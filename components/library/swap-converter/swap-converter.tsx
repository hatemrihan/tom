"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

/** Units of each currency per 1 EUR. */
export type Rates = Record<string, number>;

export interface SwapConverterProps {
  /** Currency codes offered in the two pickers. Leave out to offer every currency the rates cover. */
  currencies?: string[];
  from?: string;
  to?: string;
  /**
   * Where live rates come from: JSON with a `date` and an object of rates
   * per 1 EUR (under `rates` or `eur`). The default is the open
   * fawazahmed0/currency-api on jsDelivr: about 160 currencies, updated
   * daily, free and without a key.
   */
  endpoint?: string;
  /** Refetch interval in minutes. */
  refresh?: number;
  /** Rates used until the first response, and if the request fails. */
  fallback?: Rates;
  className?: string;
}

/** Shown first; everything else follows in alphabetical order. */
const PINNED = ["USD", "EUR", "GBP", "EGP", "SAR", "AED", "JPY", "CHF", "CAD", "AUD", "CNY", "INR", "TRY"];
const FALLBACK: Rates = { EUR: 1, USD: 1.12, GBP: 0.84, EGP: 55, SAR: 4.2, AED: 4.1, JPY: 177, CHF: 0.92, CAD: 1.59, AUD: 1.62, CNY: 7.48, INR: 105, TRY: 56 };

const fmt = (n: number, max = 2) => new Intl.NumberFormat("en-US", { maximumFractionDigits: max }).format(n);
const label = "text-[11px] font-medium uppercase leading-[1.35] tracking-[0.01em]";

/**
 * A currency converter on live rates for every currency: type an amount,
 * read the result, flip the pair. Two numbers, two pickers and one line of small print.
 */
export function SwapConverter({
  currencies,
  from = "USD",
  to = "EUR",
  endpoint = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.min.json",
  refresh = 60,
  fallback = FALLBACK,
  className,
}: SwapConverterProps) {
  const [pair, setPair] = useState<[string, string]>([from, to]);
  const [amount, setAmount] = useState("100");
  const [turns, setTurns] = useState(0);
  const [live, setLive] = useState<{ rates: Rates; date: string } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { date: string; rates?: Rates; eur?: Rates };
        const raw = data.rates ?? data.eur;
        if (cancelled || !raw) return;
        const rates: Rates = { EUR: 1 };
        for (const [code, value] of Object.entries(raw)) if (value > 0) rates[code.toUpperCase()] = value;
        setLive({ rates, date: data.date });
        setFailed(false);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };
    load();
    const timer = setInterval(load, Math.max(1, refresh) * 60_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [endpoint, refresh]);

  const rates = live?.rates ?? fallback;

  // Real currencies only (the feed also carries metals and crypto), favourites first.
  const codes = useMemo(() => {
    if (currencies) return currencies;
    const real = new Set(typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("currency") : Object.keys(rates));
    const available = Object.keys(rates).filter((c) => real.has(c));
    return [...PINNED.filter((c) => available.includes(c)), ...available.filter((c) => !PINNED.includes(c)).sort()];
  }, [currencies, rates]);
  const names = useMemo(() => new Intl.DisplayNames(["en"], { type: "currency" }), []);
  const rate = (rates[pair[1]] ?? 1) / (rates[pair[0]] ?? 1);
  const value = parseFloat(amount) || 0;
  const date = live && new Date(live.date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const picker = (index: 0 | 1) => (
    <select
      aria-label={index === 0 ? "From currency" : "To currency"}
      value={pair[index]}
      onChange={(e) => setPair((p) => (index === 0 ? [e.target.value, p[1]] : [p[0], e.target.value]))}
      // Options read "EGP  Egyptian Pound"; the closed control is clipped to the code.
      className={cn(label, "w-[3.4ch] cursor-pointer appearance-none overflow-hidden whitespace-nowrap bg-transparent text-neutral-500 outline-none hover:text-neutral-900 focus-visible:underline dark:hover:text-white")}
    >
      {codes.map((c) => (
        <option key={c} value={c}>
          {c}  {names.of(c)}
        </option>
      ))}
    </select>
  );

  const figure = "w-full bg-transparent text-5xl font-medium tabular-nums leading-none tracking-[-0.04em] text-neutral-900 outline-none dark:text-white";

  return (
    <div className={cn("w-72", className)}>
      <div className="flex items-end justify-between gap-4 border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <input
          inputMode="decimal"
          value={amount}
          onChange={(e) => {
            const v = e.target.value.replace(/[^\d.]/g, "");
            if ((v.match(/\./g) ?? []).length <= 1 && v.length <= 9) setAmount(v);
          }}
          placeholder="0"
          aria-label={`Amount in ${pair[0]}`}
          className={cn(figure, "min-w-0 placeholder:text-neutral-300 dark:placeholder:text-neutral-700")}
        />
        {picker(0)}
      </div>

      <div className="flex items-end justify-between gap-4 pt-3">
        <motion.output key={`${pair[1]}${value}${rate}`} initial={{ opacity: 0.35, y: 3 }} animate={{ opacity: 1, y: 0 }} className={cn(figure, "block truncate")}>
          {fmt(value * rate)}
        </motion.output>
        {picker(1)}
      </div>

      <div className={cn(label, "mt-5 flex items-center justify-between gap-4 font-normal text-neutral-500")}>
        <p>
          1 {pair[0]} = {fmt(rate, 4)} {pair[1]}
          <br />
          {live ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Live rate, {date}
            </span>
          ) : failed ? (
            "Offline, showing saved rates"
          ) : (
            "Fetching rates…"
          )}
        </p>
        <motion.button
          type="button"
          aria-label="Swap currencies"
          onClick={() => {
            setPair(([a, b]) => [b, a]);
            setTurns((t) => t + 1);
          }}
          animate={{ rotate: turns * 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-neutral-300 text-neutral-900 outline-none transition-colors hover:bg-neutral-900 hover:text-white focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-700 dark:text-white dark:hover:bg-white dark:hover:text-neutral-900"
        >
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 2v12m0 0-3-3m3 3 3-3M11 14V2m0 0L8 5m3-3 3 3" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
