import { createClient } from "@supabase/supabase-js";
import { logger } from "./logger";

const supabaseUrl = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
const supabaseServiceKey =
  process.env["SUPABASE_SERVICE_ROLE_KEY"] ||
  process.env["SUPABASE_ANON_KEY"] ||
  process.env["VITE_SUPABASE_ANON_KEY"];

if (!supabaseUrl || !supabaseServiceKey) {
  logger.warn("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — API routes that need the database will fail until these are set.");
}

export const supabase = createClient(supabaseUrl ?? "https://placeholder.supabase.co", supabaseServiceKey ?? "placeholder-key", {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
