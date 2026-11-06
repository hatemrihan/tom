"use client";

import { SpotlightCard, SpotlightCards } from "../spotlight-cards/spotlight-cards";

const fonts = [
  { glyph: "Aa", name: "Display 01", style: "font-serif italic" },
  { glyph: "Ag", name: "Grotesk 02", style: "font-sans font-black tracking-tighter" },
  { glyph: "Rr", name: "Mono 03", style: "font-mono" },
];

export default function SpotlightCardsDemo() {
  return (
    <div className="w-full rounded-2xl bg-black p-5">
      <SpotlightCards className="sm:grid-cols-3">
        {fonts.map((f) => (
          <SpotlightCard key={f.name}>
            <div className="flex h-40 items-center justify-center">
              <span className={`text-6xl text-white ${f.style}`}>{f.glyph}</span>
            </div>
            <p className="border-t border-white/5 px-4 py-3 text-xs text-white/60">{f.name}</p>
          </SpotlightCard>
        ))}
      </SpotlightCards>
    </div>
  );
}
