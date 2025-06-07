
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("Supabase URL is not defined. Please check NEXT_PUBLIC_SUPABASE_URL in your .env file.");
}
if (!supabaseAnonKey) {
  console.error("Supabase Anon Key is not defined. Please check NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.");
}

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase client initialized successfully (anon key).");
  } catch (error) {
    console.error("Error initializing Supabase client:", error);
    supabase = null;
  }
} else {
  console.warn(
    "Supabase client could not be initialized due to missing URL or Anon Key in .env. " +
    "Q&A history will not be saved or displayed on the admin panel."
  );
}

export { supabase };

// For server-side operations like Genkit flows, it's often better to create a new client instance
// directly within the flow using the service_role key if RLS bypass is needed and appropriate.
// This keeps client-side bundles smaller and service keys out of public-facing config.
export const createSupabaseServiceRoleClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; // Can also be SUPABASE_URL if not needed client-side
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("Supabase URL or Service Role Key is not defined for server-side client. Please check .env file.");
    return null;
  }
  try {
    const client = createClient(url, serviceKey, {
      auth: {
        // autoRefreshToken: false, // Optional: configure as needed for server clients
        // persistSession: false, // Optional: configure as needed for server clients
      }
    });
    console.log("Supabase client initialized successfully (service_role key).");
    return client;
  } catch (error) {
    console.error("Error initializing Supabase service role client:", error);
    return null;
  }
};
