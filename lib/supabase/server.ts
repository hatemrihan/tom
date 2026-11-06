import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase clients.
 *
 * - `publicClient()` uses the publishable key and is limited by Row Level
 *   Security (it can only read `component_settings`).
 * - `adminClient()` uses the secret key, bypasses RLS and must only ever run
 *   on the server (API routes / server components).
 *
 * Neither throws at import time, so `next build` works without env vars.
 */

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = () => process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const secretKey = () => process.env.SUPABASE_SECRET_KEY;

const options = { auth: { persistSession: false, autoRefreshToken: false } } as const;

const cache = globalThis as unknown as {
  __supabasePublic?: SupabaseClient;
  __supabaseAdmin?: SupabaseClient;
};

/** True when the public URL + publishable key are set. */
export function isDatabaseConfigured(): boolean {
  return Boolean(url() && publishableKey());
}

/** True when the server can also write (secret key set). */
export function isAdminDatabaseConfigured(): boolean {
  return Boolean(url() && secretKey());
}

export function publicClient(): SupabaseClient {
  if (!isDatabaseConfigured()) {
    throw new Error("Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }
  cache.__supabasePublic ??= createClient(url()!, publishableKey()!, options);
  return cache.__supabasePublic;
}

export function adminClient(): SupabaseClient {
  if (!isAdminDatabaseConfigured()) {
    throw new Error("Supabase secret key missing: set SUPABASE_SECRET_KEY");
  }
  cache.__supabaseAdmin ??= createClient(url()!, secretKey()!, options);
  return cache.__supabaseAdmin;
}
