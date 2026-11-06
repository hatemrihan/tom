"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface SwapAsset {
  symbol: string;
  name: string;
  /** Price in the base unit (e.g. USD). */
  price: number;
  color: string;
  balance?: number;
}

export interface SwapConverterProps {
  from?: SwapAsset;
  to?: SwapAsset;
  className?: string;
}

const USD: SwapAsset = { symbol: "USD", name: "US Dollar", price: 1, color: "#16a34a", balance: 1250 };
const EGP: SwapAsset = { symbol: "EGP", name: "Egyptian Pound", price: 0.0205, color: "#dc2626", balance: 0 };

const fmt = (n: number, max = 2) => new Intl.NumberFormat("en-US", { maximumFractionDigits: max }).format(n);

/**
 * A swap/convert card: type a big amount on top, see the converted value
 * below, and flip the pair with a spinning button. Assets are just props.
 */
export function SwapConverter({ from = USD, to = EGP, className }: SwapConverterProps) {
  const [pair, setPair] = useState<[SwapAsset, SwapAsset]>([from, to]);
  const [amount, setAmount] = useState("");
  const [turns, setTurns] = useState(0);
  const value = parseFloat(amount) || 0;
  const converted = (value * pair[0].price) / pair[1].price;
  const over = pair[0].balance !== undefined && value > pair[0].balance;

  return (
    <div className={cn("w-80 space-y-1.5", className)}>
      <div className="rounded-3xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <AssetRow asset={pair[0]} hint={pair[0].balance !== undefined ? `Balance ${fmt(pair[0].balance)}` : undefined}>
          {pair[0].balance !== undefined && (
            <button
              type="button"
              onClick={() => setAmount(String(pair[0].balance))}
              className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
            >
              Use max
            </button>
          )}
        </AssetRow>
        <input
          inputMode="decimal"
          value={amount}
          onChange={(e) => {
            const v = e.target.value.replace(/[^\d.]/g, "");
            if ((v.match(/\./g) ?? []).length <= 1 && v.length <= 12) setAmount(v);
          }}
          placeholder="0"
          aria-label={`Amount in ${pair[0].symbol}`}
          className={cn(
            "mt-4 w-full bg-transparent text-center text-5xl font-medium tabular-nums tracking-tight outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-700",
            over ? "text-red-500" : "text-neutral-900 dark:text-white"
          )}
        />
        <p className="mt-1 text-center text-xs text-neutral-500">{over ? "Not enough balance" : `≈ $${fmt(value * pair[0].price)}`}</p>
      </div>

      <div className="relative z-10 -my-4 flex justify-center">
        <motion.button
          type="button"
          aria-label="Swap direction"
          onClick={() => {
            setPair(([a, b]) => [b, a]);
            setAmount(converted ? String(+converted.toFixed(2)) : "");
            setTurns((t) => t + 1);
          }}
          animate={{ rotate: turns * 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex size-9 items-center justify-center rounded-xl border-4 border-neutral-50 bg-neutral-100 text-neutral-600 dark:border-neutral-950 dark:bg-neutral-800 dark:text-neutral-300"
        >
          ↓
        </motion.button>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <AssetRow asset={pair[1]} hint={`1 ${pair[0].symbol} = ${fmt(pair[0].price / pair[1].price, 4)} ${pair[1].symbol}`}>
          <motion.span key={converted} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-medium tabular-nums text-neutral-900 dark:text-white">
            {fmt(converted)}
          </motion.span>
        </AssetRow>
      </div>

      <button
        type="button"
        disabled={!value || over}
        className="h-11 w-full rounded-2xl bg-neutral-900 text-sm font-medium text-white transition active:scale-[0.99] disabled:bg-neutral-200 disabled:text-neutral-400 dark:bg-white dark:text-neutral-900 dark:disabled:bg-neutral-800"
      >
        {!value ? "Enter an amount" : over ? "Insufficient balance" : `Convert ${pair[0].symbol} → ${pair[1].symbol}`}
      </button>
    </div>
  );
}

function AssetRow({ asset, hint, children }: { asset: SwapAsset; hint?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: asset.color }}>
        {asset.symbol.slice(0, 3)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-neutral-900 dark:text-white">{asset.name}</p>
        {hint && <p className="truncate text-[11px] text-neutral-500">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
