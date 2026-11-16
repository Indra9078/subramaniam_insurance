import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./env";

/** Browser client for the admin photo uploader. Uses the admin's session cookie. */
export const createBrowserSupabase = () => createBrowserClient(supabaseUrl, supabaseKey);
