const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const supabase = require("../config/supabase");

const VALID_ROLES = ["owner", "trainer", "customer"];

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password, and role are required",
            });
        }

        if (!VALID_ROLES.includes(role)) {
            return res.status(400).json({
                success: false,
                message: `Role must be one of: ${VALID_ROLES.join(", ")}`,
            });
        }

        // Check if user already exists with this email and role
        const { data: existing, error: checkError } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .eq("role", role)
            .limit(1);

        if (checkError) throw checkError;

        if (existing && existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: `An account with this email already exists as ${role}.`,
            });
        }

        // 1. Sign up user using Supabase Auth to trigger verification email
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    role
                }
            }
        });

        if (authError) {
            console.error("Supabase Auth error:", authError);
            return res.status(400).json({
                success: false,
                message: authError.message
            });
        }

        // Hash password before storing in our custom users table
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("Attempting to insert user into custom table...");
        
        // 2. Insert new user into our custom users table
        const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert([{
                id: authData.user?.id, // Link to auth.users id
                name,
                email,
                password: hashedPassword,
                role,
            }])
            .select()
            .single();

        if (insertError) {
            console.error("Supabase insert error:", insertError);
            throw insertError;
        }

        res.status(201).json({
            success: true,
            message: `Account created successfully! Please check your email (${email}) to verify your account before logging in.`,
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role,
                name: newUser.name,
                password: newUser.password, // Included hashed password as requested
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
            error: error.message
        });
    }
});

// In-memory store for pending OAuth sessions
let pendingOAuth = {};

// OAuth: Get Google sign-in URL (redirects directly to app with implicit flow)
router.post("/oauth/google", async (req, res) => {
    try {
        const { role = "customer", redirectUrl } = req.body || {};
        // Redirect directly to the app — Supabase sends tokens in hash fragment
        const redirectTo = redirectUrl || 'client://oauth';
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo, skipBrowserRedirect: true }
        });
        if (error) {
            console.error("OAuth URL error:", error.message);
            return res.status(400).json({ success: false, message: error.message });
        }
        pendingOAuth = { role };
        console.log("OAuth redirect URL:", redirectTo);
        res.json({ success: true, url: data.url });
    } catch (error) {
        console.error("OAuth URL generation error:", error.message);
        res.status(500).json({ success: false, message: "Server error generating OAuth URL" });
    }
});

// OAuth: Server callback — exchanges code, creates user, redirects to app
router.get("/oauth/callback/google", async (req, res) => {
    const { clientRedirectUrl, role } = pendingOAuth;
    const appRedirect = clientRedirectUrl || 'client://oauth';
    try {
        const code = req.query.code;
        if (!code) {
            console.error("OAuth callback: no code in query params. Query:", req.query);
            return res.redirect(`${appRedirect}?status=error&message=${encodeURIComponent("Missing authorization code")}`);
        }
        const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
            console.error("OAuth exchange error:", exchangeError.message);
            return res.redirect(`${appRedirect}?status=error&message=${encodeURIComponent(exchangeError.message)}`);
        }
        const authedUser = sessionData.user;
        const email = authedUser?.email;
        const name = authedUser?.user_metadata?.full_name || authedUser?.user_metadata?.name || email;
        if (!email) {
            return res.redirect(`${appRedirect}?status=error&message=${encodeURIComponent("No email from provider")}`);
        }
        // Ensure user exists in custom users table
        const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .eq("role", role || "customer")
            .limit(1);
        if (!existingUser || existingUser.length === 0) {
            const fakeHash = await bcrypt.hash("oauth-google", 10);
            await supabase.from("users").insert([{
                id: authedUser.id, name, email, password: fakeHash, role: role || "customer"
            }]);
        }
        console.log("OAuth success! Redirecting to:", appRedirect);
        return res.redirect(`${appRedirect}?status=success&role=${encodeURIComponent(role || "customer")}`);
    } catch (error) {
        console.error("OAuth callback error:", error.message);
        return res.redirect(`${appRedirect}?status=error&message=${encodeURIComponent(error.message)}`);
    }
});

// OAuth: Verify access token and create/find user in custom table
router.post("/oauth/verify", async (req, res) => {
    try {
        const { access_token, role = "customer" } = req.body;
        if (!access_token) {
            return res.status(400).json({ success: false, message: "Missing access token" });
        }
        const { data: { user }, error } = await supabase.auth.getUser(access_token);
        if (error || !user) {
            console.error("OAuth verify error:", error?.message);
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
        const email = user.email;
        const name = user.user_metadata?.full_name || user.user_metadata?.name || email;
        const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .eq("role", role)
            .limit(1);
        if (!existingUser || existingUser.length === 0) {
            const fakeHash = await bcrypt.hash("oauth-google", 10);
            await supabase.from("users").insert([{
                id: user.id, name, email, password: fakeHash, role
            }]);
        }
        const userData = (existingUser && existingUser.length > 0) ? existingUser[0] : { id: user.id, email, role, name };
        res.json({
            success: true,
            message: "Google sign-in successful! 💪",
            user: { id: userData.id, email: userData.email, role: userData.role, name: userData.name },
        });
    } catch (error) {
        console.error("OAuth verify error:", error.message);
        res.status(500).json({ success: false, message: "Server error verifying OAuth token" });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Email, password, and role are required",
            });
        }

        if (!VALID_ROLES.includes(role)) {
            return res.status(400).json({
                success: false,
                message: `Role must be one of: ${VALID_ROLES.join(", ")}`,
            });
        }

        // Authenticate with Supabase Auth to verify email is confirmed
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            console.error("Supabase Auth Login error:", authError);
            return res.status(401).json({
                success: false,
                message: authError.message === 'Email not confirmed' 
                    ? "Please verify your email address before logging in." 
                    : "Invalid email or password."
            });
        }

        // Query the users table for matching role
        const { data: users, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .eq("role", role)
            .limit(1);

        if (error) throw error;

        if (!users || users.length === 0) {
            return res.status(401).json({
                success: false,
                message: `User not found with role: ${role}`,
            });
        }

        const user = users[0];

        res.status(200).json({
            success: true,
            message: "Login successful! 💪",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name || user.email,
                password: user.password, // Included hashed password as requested
            },
            session: authData.session
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
});

module.exports = router;
