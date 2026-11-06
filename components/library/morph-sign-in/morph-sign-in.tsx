"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface MorphSignInProps {
  /** Called with the entered email. Return a promise to show a loading state. */
  onSubmit?: (email: string) => void | Promise<void>;
  label?: string;
  className?: string;
}

/**
 * A small "Sign in" pill that morphs into a sign-in card in place, and back.
 * After submitting, the card confirms with a check before collapsing.
 */
export function MorphSignIn({ onSubmit, label = "Sign in", className }: MorphSignInProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");
  const id = useId();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    setState("loading");
    await (onSubmit?.(email) ?? new Promise((r) => setTimeout(r, 900)));
    setState("sent");
    setTimeout(() => {
      setOpen(false);
      setState("idle");
      setEmail("");
    }, 1400);
  };

  return (
    <div ref={root} className={cn("relative flex justify-center", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {!open ? (
          <motion.button
            key="btn"
            layoutId={id}
            type="button"
            onClick={() => setOpen(true)}
            style={{ borderRadius: 999 }}
            className="h-10 bg-neutral-900 px-5 text-sm font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:bg-white dark:text-neutral-900"
          >
            <motion.span layoutId={`${id}-label`} className="block">
              {label}
            </motion.span>
          </motion.button>
        ) : (
          <motion.form
            key="form"
            layoutId={id}
            onSubmit={submit}
            style={{ borderRadius: 24 }}
            className="w-72 bg-neutral-900 p-5 text-white dark:bg-white dark:text-neutral-900"
          >
            <AnimatePresence mode="wait" initial={false}>
              {state === "sent" ? (
                <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-6 text-center">
                  <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth={2.2}>
                    <motion.path d="M5 13l4 4L19 7" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
                  </svg>
                  <p className="mt-3 text-sm font-medium">Check your inbox</p>
                  <p className="mt-1 text-xs opacity-60">A magic link is on its way.</p>
                </motion.div>
              ) : (
                <motion.div key="form" exit={{ opacity: 0 }}>
                  <motion.span layoutId={`${id}-label`} className="block text-base font-medium">
                    {label}
                  </motion.span>
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.12 } }}>
                    <p className="mt-1 text-xs opacity-60">We&apos;ll email you a magic link.</p>
                    <input
                      type="email"
                      autoFocus
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@studio.com"
                      aria-label="Email"
                      className="mt-4 h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm outline-none placeholder:opacity-40 focus:border-white/30 dark:border-black/10 dark:bg-black/5 dark:focus:border-black/30"
                    />
                    <button
                      type="submit"
                      disabled={state === "loading"}
                      className="mt-3 flex h-10 w-full items-center justify-center rounded-xl bg-white text-sm font-medium text-neutral-900 transition active:scale-[0.98] disabled:opacity-70 dark:bg-neutral-900 dark:text-white"
                    >
                      {state === "loading" ? <span className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current" /> : "Continue"}
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
