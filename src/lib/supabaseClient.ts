
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// The client-side client is now lazy-loaded to prevent SSR crashes
// if the environment variables are not set in the production environment.
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
      console.log("Supabase client initialized successfully (anon key).");
      return supabaseInstance;
    } catch (error) {
      console.error("Error initializing Supabase client:", error);
      supabaseInstance = null;
      return null;
    }
  } else {
    console.warn(
      "Supabase client could not be initialized due to missing URL or Anon Key in .env. " +
      "Features relying on the client-side Supabase instance may not work."
    );
    return null;
  }
}

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
