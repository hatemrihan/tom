"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface ReceiptItem {
  label: string;
  /** Unit price. */
  price: number;
  qty?: number;
}

export interface ReceiptPrinterProps {
  /** Shop name and the lines under it (address, phone, tax number). */
  merchant?: { name: string; lines?: string[] };
  items?: ReceiptItem[];
  /** Tax added on top of the items, e.g. 0.2 for 20%. */
  taxRate?: number;
  taxLabel?: string;
  /** ISO currency code. */
  currency?: string;
  /** How it was paid, e.g. { method: "Visa contactless", last4: "4242" }. */
  payment?: { method: string; last4?: string };
  /** Printed date. Defaults to the moment the payment clears. */
  date?: Date;
  /** Closing line. */
  footer?: string;
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

const TORN = "radial-gradient(circle at 5px 100%, transparent 3.5px, black 4px) 0 0 / 10px 100% repeat-x";

/**
 * A card payment that ends the way a real one does: the reader says
 * "approved" and a paper receipt feeds out of the slot, with the shop,
 * the items, the tax, the card and an authorisation code.
 */
export function ReceiptPrinter({
  merchant = { name: "Corner Coffee", lines: ["14 Mill Lane, Cambridge CB2 1RX", "VAT no. GB 123 4567 89"] },
  items = [
    { label: "Flat white", price: 3.4, qty: 2 },
    { label: "Almond croissant", price: 3.2 },
    { label: "Sparkling water", price: 2.1 },
  ],
  taxRate = 0.2,
  taxLabel = "VAT",
  currency = "GBP",
  payment = { method: "Visa contactless", last4: "4242" },
  date,
  footer = "Thank you. See you tomorrow.",
  processingTime = 2200,
  className,
}: ReceiptPrinterProps) {
  const [phase, setPhase] = useState<"processing" | "printing">("processing");
  const [paidAt, setPaidAt] = useState<Date | null>(date ?? null);

  const money = useMemo(() => {
    const f = new Intl.NumberFormat("en-GB", { style: "currency", currency });
    return (n: number) => f.format(n);
  }, [currency]);

  const subtotal = items.reduce((sum, i) => sum + i.price * (i.qty ?? 1), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Stable numbers derived from the contents, so server and client agree.
  const seed = hash(`${merchant.name}${items.map((i) => i.label).join()}${total}`);
  const receiptNo = String(seed % 1_000_000).padStart(6, "0");
  const auth = (hash(`auth${seed}`) % 0xffffff).toString(16).toUpperCase().padStart(6, "0");
  const bars = useMemo(() => Array.from({ length: 46 }, (_, i) => 1 + (hash(`${seed}-${i}`) % 3)), [seed]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPaidAt((d) => d ?? new Date());
      setPhase("printing");
    }, processingTime);
    return () => clearTimeout(timer);
  }, [processingTime]);

  const stamp = paidAt
    ? `${paidAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}  ${paidAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
    : "";
  const row = "flex justify-between gap-4";
  const rule = "my-2.5 border-t border-dashed border-neutral-300";

  return (
    <div className={cn("w-[260px] text-[11px] font-medium uppercase leading-[1.35] tracking-[0.01em] text-neutral-900 dark:text-white", className)}>
      {/* reader: amount, a live status, and the slot filling while the payment is processed */}
      <div className={row}>
        <span>{money(total)}</span>
        <span className="flex items-center gap-1.5 font-normal" role="status">
          {phase === "processing" ? (
            <>
              <span className="size-2.5 animate-spin rounded-full border border-current border-t-transparent" />
              Processing payment
            </>
          ) : (
            <>
              <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M2 6.500 5 9l5-6" />
              </svg>
              Approved
            </>
          )}
        </span>
      </div>
      <div className="relative z-10 mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <motion.div
          className="h-full origin-left bg-neutral-900 dark:bg-white"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: processingTime / 1000, ease: "linear" }}
        />
      </div>

      {/* paper */}
      <div className="-mt-0.5 overflow-hidden px-2 pb-3">
        <motion.div
          initial={{ y: "-101%" }}
          animate={{ y: phase === "processing" ? "-101%" : "0%" }}
          transition={{ duration: 1.8, ease: [0.3, 0, 0.2, 1] }}
          className="bg-white px-4 pb-6 pt-5 font-mono text-[10px] font-normal leading-[1.5] tracking-normal text-neutral-600 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]"
          style={{ maskImage: TORN, WebkitMaskImage: TORN }}
        >
          <p className="text-center font-semibold text-neutral-900">{merchant.name}</p>
          {merchant.lines?.map((l) => (
            <p key={l} className="text-center text-[9px]">
              {l}
            </p>
          ))}

          <div className={rule} />
          <p className={row}>
            <span>Receipt {receiptNo}</span>
            <span>{stamp}</span>
          </p>
          <div className={rule} />

          {items.map((item) => {
            const qty = item.qty ?? 1;
            return (
              <p key={item.label} className={row}>
                <span>
                  {qty} × {item.label}
                </span>
                <span className="tabular-nums">{money(item.price * qty)}</span>
              </p>
            );
          })}

          <div className={rule} />
          <p className={row}>
            <span>Subtotal</span>
            <span className="tabular-nums">{money(subtotal)}</span>
          </p>
          <p className={row}>
            <span>
              {taxLabel} {Math.round(taxRate * 100)}%
            </span>
            <span className="tabular-nums">{money(tax)}</span>
          </p>
          <p className={cn(row, "mt-1 text-[12px] font-semibold text-neutral-900")}>
            <span>Total</span>
            <span className="tabular-nums">{money(total)}</span>
          </p>

          <div className={rule} />
          <p className={row}>
            <span>{payment.method}</span>
            {payment.last4 && <span>•••• {payment.last4}</span>}
          </p>
          <p className={row}>
            <span>Auth code</span>
            <span>{auth}</span>
          </p>

          <div className="mt-4 flex h-7 items-stretch justify-center gap-px" aria-hidden>
            {bars.map((w, i) => (
              <span key={i} className="bg-neutral-900" style={{ width: w }} />
            ))}
          </div>
          <p className="mt-3 text-center text-[9px]">{footer}</p>
        </motion.div>
      </div>
    </div>
  );
}
