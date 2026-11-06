"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, Loader2 } from "lucide-react";

export function AdminLogin() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!key.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Sign in failed");
      setKey("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2 text-neutral-900">
          <span className="size-3.5 bg-neutral-900" />
          <span className="text-[15px] font-medium tracking-tight">TOM — Admin</span>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
            <KeyRound className="size-[18px]" />
          </div>
          <h1 className="text-lg font-medium text-neutral-900">Welcome back</h1>
          <p className="mt-1 text-sm text-neutral-500">Enter your admin key to continue.</p>

          <label htmlFor="admin-key" className="sr-only">
            Admin key
          </label>
          <input
            id="admin-key"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin key"
            className="mt-5 h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:ring-4 focus:ring-neutral-100"
          />

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !key.trim()}
            className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <>Sign in <ArrowRight className="size-4" /></>}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-neutral-400">
          Session lasts 7 days on this device.
        </p>
      </div>
    </main>
  );
}
