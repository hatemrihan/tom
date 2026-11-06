"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface BracketTeam {
  name: string;
  badge?: string; // emoji or short text
  score?: number;
}

export interface BracketMatch {
  date?: string;
  teams: [BracketTeam | null, BracketTeam | null];
}

export interface KnockoutBracketProps {
  /** Rounds from first to final. Each round has half the matches of the previous. */
  rounds: { title: string; matches: BracketMatch[] }[];
  /** How many rounds are visible at once (pages with arrows on small screens). */
  visible?: number;
  className?: string;
}

const MATCH_H = 84;
const GAP = 14;

/**
 * A tournament knockout bracket with connector lines. Winners are
 * highlighted; hover a team to trace its path. Pages left/right when there
 * are more rounds than fit.
 */
export function KnockoutBracket({ rounds, visible = 3, className }: KnockoutBracketProps) {
  const [start, setStart] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const shown = rounds.slice(start, start + visible);
  const first = shown[0]?.matches.length ?? 1;
  const height = first * MATCH_H + (first - 1) * GAP;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-3 flex items-center text-xs text-neutral-500">
        <button type="button" aria-label="Previous round" disabled={start === 0} onClick={() => setStart((s) => s - 1)} className="px-2 text-lg disabled:opacity-20">
          «
        </button>
        <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${shown.length}, 1fr)` }}>
          {shown.map((r) => (
            <span key={r.title} className="text-center">{r.title}</span>
          ))}
        </div>
        <button type="button" aria-label="Next round" disabled={start + visible >= rounds.length} onClick={() => setStart((s) => s + 1)} className="px-2 text-lg disabled:opacity-20">
          »
        </button>
      </div>

      <motion.div key={start} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative grid gap-6" style={{ gridTemplateColumns: `repeat(${shown.length}, 1fr)`, height }}>
        {shown.map((round, ri) => {
          const slot = height / round.matches.length;
          return (
            <div key={round.title} className="relative">
              {round.matches.map((m, mi) => {
                const top = slot * mi + (slot - MATCH_H) / 2;
                const winner = winnerIndex(m);
                return (
                  <div key={mi}>
                    <div className="absolute inset-x-0 rounded-xl border border-neutral-200 bg-white p-2.5 dark:border-neutral-800 dark:bg-neutral-900" style={{ top, height: MATCH_H }}>
                      {m.date && <p className="mb-1 text-[10px] text-neutral-400">{m.date}</p>}
                      {m.teams.map((t, ti) => (
                        <div
                          key={ti}
                          onMouseEnter={() => t && setHover(t.name)}
                          onMouseLeave={() => setHover(null)}
                          className={cn(
                            "flex items-center gap-2 rounded px-1 py-0.5 text-xs transition-colors",
                            !t ? "text-neutral-400" : winner === ti ? "font-medium text-neutral-900 dark:text-white" : "text-neutral-500",
                            t && hover === t.name && "bg-neutral-100 dark:bg-neutral-800"
                          )}
                        >
                          <span className="w-4 text-center">{t?.badge ?? "○"}</span>
                          <span className="flex-1 truncate">{t?.name ?? "TBD"}</span>
                          {t?.score !== undefined && <span className="tabular-nums">{t.score}</span>}
                        </div>
                      ))}
                    </div>
                    {/* Connector to the next round */}
                    {ri < shown.length - 1 && mi % 2 === 0 && round.matches[mi + 1] && (
                      <svg aria-hidden className="pointer-events-none absolute -right-6 overflow-visible" style={{ top: top + MATCH_H / 2, height: slot, width: 24 }}>
                        <path d={`M0 0 H12 V${slot} H0 M12 ${slot / 2} H24`} fill="none" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth={1} />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

function winnerIndex(m: BracketMatch): number | null {
  const [a, b] = m.teams;
  if (a?.score === undefined || b?.score === undefined) return null;
  return a.score === b.score ? null : a.score > b.score ? 0 : 1;
}
