import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client (publishable key, RLS-limited).
 * Not used yet: the site talks to Supabase through its API routes.
 * Use this if you later add Supabase Auth or realtime in client components.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
