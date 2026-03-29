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

// OAuth: Get Google sign-in URL
router.post("/oauth/google", async (req, res) => {
    try {
        const { role = "customer" } = req.body || {};
        const callbackBase = process.env.SERVER_OAUTH_CALLBACK || `http://192.168.29.13:${process.env.PORT || 5001}/api/auth/oauth/callback/google`;
        const redirectTo = `${callbackBase}?role=${encodeURIComponent(role)}`;
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo }
        });
        if (error) {
            console.error("OAuth URL error:", error.message);
            return res.status(400).json({ success: false, message: error.message });
        }
        res.json({ success: true, url: data.url });
    } catch (error) {
        console.error("OAuth URL generation error:", error.message);
        res.status(500).json({ success: false, message: "Server error generating OAuth URL" });
    }
});

// OAuth: Callback handler
router.get("/oauth/callback/google", async (req, res) => {
    try {
        const { code, role = "customer" } = req.query;
        if (!code) return res.status(400).send("Missing code");
        const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession({ code });
        
        const scheme = process.env.APP_SCHEME || 'client';
        // Always try to redirect back to the app scheme on mobile, avoid trying to route to localhost web URLs
        const baseRedirect = `${scheme}://oauth`;

        if (exchangeError) {
            console.error("OAuth exchange error:", exchangeError.message);
            return res.redirect(`${baseRedirect}?status=error&message=${encodeURIComponent(exchangeError.message)}`);
        }
        const authedUser = sessionData.user;
        const email = authedUser?.email;
        const name = authedUser?.user_metadata?.name || email;
        if (!email) {
            return res.redirect(`${baseRedirect}?status=error&message=${encodeURIComponent("No email from provider")}`);
        }
        // Ensure existence in custom users table
        const fakeHash = await bcrypt.hash("oauth-google", 10);
        const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .eq("role", role)
            .limit(1);
        if (!existingUser || existingUser.length === 0) {
            const { error: insertErr } = await supabase
                .from("users")
                .insert([{ id: authedUser.id, name, email, password: fakeHash, role }]);
            if (insertErr) {
                console.error("Insert OAuth user error:", insertErr.message);
            }
        }
        return res.redirect(`${baseRedirect}?status=success&role=${encodeURIComponent(role)}`);
    } catch (error) {
        console.error("OAuth callback error:", error.message);
        const scheme = process.env.APP_SCHEME || 'client';
        const baseRedirect = `${scheme}://oauth`;
        return res.redirect(`${baseRedirect}?status=error&message=${encodeURIComponent(error.message)}`);
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
