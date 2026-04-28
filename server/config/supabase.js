const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Missing Supabase URL or Anon Key in .env file");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        flowType: 'implicit',
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
    }
});

console.log("✅ Supabase client initialized");

module.exports = supabase;
