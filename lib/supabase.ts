import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client (use only on server-side, requires service role key in env)
export const supabaseServer =
  supabaseServiceRole && supabaseUrl
    ? createClient(supabaseUrl, supabaseServiceRole)
    : null;

// Helper to check if user is logged in (client)
export const checkAuth = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user || null;
};
