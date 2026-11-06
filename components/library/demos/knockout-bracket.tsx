"use client";

import { KnockoutBracket } from "../knockout-bracket/knockout-bracket";

export default function KnockoutBracketDemo() {
  return (
    <KnockoutBracket
      className="max-w-2xl"
      rounds={[
        {
          title: "Quarter-finals",
          matches: [
            { date: "Sat 11 Jul", teams: [{ name: "Egypt", badge: "🇪🇬", score: 2 }, { name: "Morocco", badge: "🇲🇦", score: 1 }] },
            { date: "Sat 11 Jul", teams: [{ name: "Spain", badge: "🇪🇸", score: 3 }, { name: "Belgium", badge: "🇧🇪", score: 1 }] },
            { date: "Sun 12 Jul", teams: [{ name: "Japan", badge: "🇯🇵", score: 0 }, { name: "Brazil", badge: "🇧🇷", score: 2 }] },
            { date: "Sun 12 Jul", teams: [{ name: "France", badge: "🇫🇷" }, { name: "Mexico", badge: "🇲🇽" }] },
          ],
        },
        {
          title: "Semi-finals",
          matches: [
            { date: "Wed 15 Jul", teams: [{ name: "Egypt", badge: "🇪🇬" }, { name: "Spain", badge: "🇪🇸" }] },
            { date: "Thu 16 Jul", teams: [{ name: "Brazil", badge: "🇧🇷" }, null] },
          ],
        },
        { title: "Final", matches: [{ date: "Sun 19 Jul", teams: [null, null] }] },
      ]}
    />
  );
}
