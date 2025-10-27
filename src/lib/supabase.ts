import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // Supabase URL from environment variables
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Supabase anonymous key from environment variables

/**
 * Create a Supabase client
 * @returns {SupabaseClient} Supabase client
 */
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "The Supabase environment variables are not configured correctly"
  );
}

/**
 * Create a Supabase client
 * @returns {SupabaseClient} Supabase client
 */
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Export the Supabase client
 * @returns {SupabaseClient} Supabase client
 */
export default supabase;
