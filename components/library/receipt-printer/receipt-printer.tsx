"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface ReceiptLine {
  label: string;
  amount: number;
}

export interface ReceiptPrinterProps {
  title?: string;
  subtitle?: string;
  lines?: ReceiptLine[];
  taxRate?: number;
  currency?: string;
  /** ms spent "processing" before the receipt prints. */
  processingTime?: number;
  className?: string;
}

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const money = (n: number, currency: string) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(n);

/**
 * A checkout card that "processes" a payment, then feeds a paper receipt out
 * of a slot — complete with a perforated tear edge and barcode.
 */
export function ReceiptPrinter({
  title = "Pro plan",
  subtitle = "Annual subscription",
  lines = [
    { label: "Pro plan × 12", amount: 192 },
    { label: "Priority support", amount: 0 },
  ],
  taxRate = 0.2,
  currency = "GBP",
  processingTime = 1800,
  className,
}: ReceiptPrinterProps) {
  const [phase, setPhase] = useState<"processing" | "printing" | "done">("processing");
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  // Deterministic "random" order number + barcode (same on server and client).
  const seed = useMemo(() => hash(`${title}${subtitle}${total}`), [title, subtitle, total]);
  const order = useMemo(() => seed.toString(36).toUpperCase().padStart(8, "0").slice(0, 8), [seed]);
  const bars = useMemo(() => Array.from({ length: 42 }, (_, i) => 1 + (hash(`${seed}-${i}`) % 3)), [seed]);

  useEffect(() => {
    const a = setTimeout(() => setPhase("printing"), processingTime);
    const b = setTimeout(() => setPhase("done"), processingTime + 1600);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [processingTime]);

  return (
    <div className={cn("relative w-[300px] pb-[260px]", className)}>
      {/* Receipt — sits behind the terminal and slides out of its slot */}
      <div className="absolute inset-x-5 top-[118px] h-[300px] overflow-hidden">
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: phase === "processing" ? "-100%" : "0%" }}
          transition={{ duration: 1.5, ease: [0.45, 0, 0.2, 1] }}
          className="relative bg-white px-5 pb-6 pt-7 font-mono text-[10px] uppercase text-neutral-700 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]"
          style={{
            maskImage:
              "radial-gradient(circle at 6px 100%, transparent 4px, black 4.5px) 0 0 / 12px 100% repeat-x",
            WebkitMaskImage:
              "radial-gradient(circle at 6px 100%, transparent 4px, black 4.5px) 0 0 / 12px 100% repeat-x",
          }}
        >
          <div className="flex justify-between">
            <span className="font-semibold text-neutral-900">{title}</span>
            <span>{money(subtotal, currency)}</span>
          </div>
          <p className="mt-0.5 text-[9px] normal-case text-neutral-400">{subtitle}</p>
          <div className="my-3 border-t border-dashed border-neutral-300" />
          {lines.map((l) => (
            <div key={l.label} className="flex justify-between py-0.5">
              <span>{l.label}</span>
              <span>{money(l.amount, currency)}</span>
            </div>
          ))}
          <div className="flex justify-between py-0.5">
            <span>VAT {Math.round(taxRate * 100)}%</span>
            <span>{money(tax, currency)}</span>
          </div>
          <div className="my-3 border-t border-dashed border-neutral-300" />
          <div className="flex justify-between text-[11px] font-semibold text-neutral-900">
            <span>Total paid</span>
            <span>{money(total, currency)}</span>
          </div>
          <div className="mt-4 flex h-8 items-stretch justify-center gap-px">
            {bars.map((w, i) => (
              <span key={i} className="bg-neutral-900" style={{ width: w }} />
            ))}
          </div>
          <p className="mt-1.5 text-center text-[8px] tracking-[0.3em] text-neutral-400">#{order}</p>
        </motion.div>
      </div>

      {/* Terminal */}
      <div className="relative z-10 rounded-[22px] bg-neutral-900 p-2 shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="rounded-2xl bg-neutral-800/80 p-4 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-white/50">{subtitle}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/50">Total</p>
              <p className="text-lg font-semibold tabular-nums">{money(total, currency)}</p>
            </div>
          </div>
          <div className="mt-3 flex h-5 items-center gap-2 text-xs text-white/70">
            <AnimatePresence mode="wait" initial={false}>
              {phase === "processing" ? (
                <motion.span key="p" className="flex items-center gap-2" exit={{ opacity: 0, y: -4 }}>
                  <span className="size-3 animate-spin rounded-full border-[1.5px] border-white/25 border-t-white" />
                  Processing your order
                </motion.span>
              ) : (
                <motion.span
                  key="d"
                  className="flex items-center gap-2 text-emerald-400"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="flex size-3.5 items-center justify-center rounded-full bg-emerald-400 text-[9px] text-neutral-900">✓</span>
                  Payment complete
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Paper slot */}
        <div className="mx-3 mt-2 h-1.5 rounded-full bg-black shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
      </div>
    </div>
  );
}
