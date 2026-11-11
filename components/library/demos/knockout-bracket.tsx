import { KnockoutBracket } from "../knockout-bracket/knockout-bracket";

/** The 2022 World Cup, from the quarter-finals. */
export default function KnockoutBracketDemo() {
  return (
    <KnockoutBracket
      className="w-auto"
      rounds={[
        {
          title: "Quarter-finals",
          matches: [
            { note: "9 Dec", teams: [{ name: "Croatia", score: 1, pens: 4 }, { name: "Brazil", score: 1, pens: 2 }] },
            { note: "9 Dec", teams: [{ name: "Netherlands", score: 2, pens: 3 }, { name: "Argentina", score: 2, pens: 4 }] },
            { note: "10 Dec", teams: [{ name: "Morocco", score: 1 }, { name: "Portugal", score: 0 }] },
            { note: "10 Dec", teams: [{ name: "England", score: 1 }, { name: "France", score: 2 }] },
          ],
        },
        {
          title: "Semi-finals",
          matches: [
            { note: "13 Dec", teams: [{ name: "Croatia", score: 0 }, { name: "Argentina", score: 3 }] },
            { note: "14 Dec", teams: [{ name: "Morocco", score: 0 }, { name: "France", score: 2 }] },
          ],
        },
        {
          title: "Final",
          matches: [{ note: "18 Dec, Lusail", teams: [{ name: "Argentina", score: 3, pens: 4 }, { name: "France", score: 3, pens: 2 }] }],
        },
      ]}
    />
  );
}
