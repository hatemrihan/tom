import { cn } from "../_lib/cn";

export interface BracketTeam {
  name: string;
  score?: number;
  /** Penalty shoot-out score, shown in brackets after the score. */
  pens?: number;
}

export interface BracketMatch {
  /** Small line above the match: a date, a venue, a stage. */
  note?: string;
  teams: [BracketTeam | null, BracketTeam | null];
}

export interface KnockoutBracketProps {
  /** Rounds from first to final. Each round has half the matches of the one before. */
  rounds: { title: string; matches: BracketMatch[] }[];
  /** Shown where a team isn't known yet. */
  placeholder?: string;
  className?: string;
}

const winnerOf = ([a, b]: BracketMatch["teams"]) => {
  if (!a || !b || a.score === undefined || b.score === undefined) return -1;
  if (a.score !== b.score) return a.score > b.score ? 0 : 1;
  if (a.pens !== undefined && b.pens !== undefined && a.pens !== b.pens) return a.pens > b.pens ? 0 : 1;
  return -1;
};

/**
 * A tournament bracket drawn like a fixture list: names, scores and thin
 * rules joining each pair to the next round. No boxes, no badges.
 */
export function KnockoutBracket({ rounds, placeholder = "To be decided", className }: KnockoutBracketProps) {
  return (
    <div className={cn("w-full overflow-x-auto text-[11px] font-medium uppercase leading-[1.35] tracking-[0.01em]", className)}>
      <div className="flex min-w-max gap-10">
        {rounds.map((round, r) => (
          <div key={round.title} className="flex w-44 flex-col">
            <p className="mb-4 font-normal text-neutral-400">{round.title}</p>
            <ol className="flex flex-1 flex-col">
              {round.matches.map((match, i) => {
                const winner = winnerOf(match.teams);
                return (
                  <li key={i} className="relative flex flex-1 flex-col justify-center py-3">
                    {match.note && <p className="mb-1 font-normal text-neutral-400">{match.note}</p>}
                    {match.teams.map((team, t) => (
                      <p
                        key={t}
                        className={cn(
                          "flex justify-between gap-3 tabular-nums",
                          !team
                            ? "font-normal text-neutral-300 dark:text-neutral-600"
                            : winner === t || winner === -1
                              ? "text-neutral-900 dark:text-white"
                              : "font-normal text-neutral-400"
                        )}
                      >
                        <span className="truncate">{team?.name ?? placeholder}</span>
                        {team?.score !== undefined && (
                          <span>
                            {team.score}
                            {team.pens !== undefined && <span className="font-normal"> ({team.pens})</span>}
                          </span>
                        )}
                      </p>
                    ))}

                    {/* rules: out to the right, down or up to its pair, and in from the left */}
                    {r < rounds.length - 1 && (
                      <>
                        <span aria-hidden className="absolute -right-5 top-1/2 h-px w-3 bg-neutral-300 dark:bg-neutral-700" />
                        <span
                          aria-hidden
                          className={cn("absolute -right-5 w-px bg-neutral-300 dark:bg-neutral-700", i % 2 === 0 ? "bottom-0 top-1/2" : "bottom-1/2 top-0")}
                        />
                      </>
                    )}
                    {r > 0 && <span aria-hidden className="absolute -left-5 top-1/2 h-px w-3 bg-neutral-300 dark:bg-neutral-700" />}
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
