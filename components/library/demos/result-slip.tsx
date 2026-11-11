"use client";

import { ResultSlip } from "../result-slip/result-slip";

export default function ResultSlipDemo() {
  return (
    <ResultSlip
      title={["TOM component", "result", "slip"]}
      about="An open-source library of React components with motion, detail and feel."
      figure={
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" className="p-3" aria-label="TOM">
          <path d="M21 57c-4-9-5-22-1-32 4-11 16-14 23-6 2 3 4 5 9 6 5 1 7 4 7 8s-3 6-8 6c-6 0-9 2-10 6-1 4 0 8 2 12" />
          <path d="M27 17c-11-2-17 8-15 21 1 7 9 7 11-1 1-6 1-12 4-20Z" />
          <circle cx="40" cy="27" r="2" fill="currentColor" stroke="none" />
          <circle cx="56.5" cy="31.5" r="4" fill="currentColor" stroke="none" />
          <path d="M19 50q12 4 23 0" />
        </svg>
      }
      contacts={[
        { label: "X", value: "@hatemrihan" },
        { label: "Web", value: "tomm.one/components" },
      ]}
      places={[
        { city: "Source", lines: ["github.com/hatemrihan/tom", "MIT licence"] },
        { city: "Stack", lines: ["React, TypeScript,", "Tailwind CSS, Motion"] },
      ]}
      disclaimer="Please read carefully before proceeding. The contents of this slip are components, not a framework. Copy one file, change anything, ship it."
      stamp="Duplicate copy"
      wordmark="TOM"
      credit="Every component is designed, built and tested by hand for interfaces that feel alive."
      footer="© 2026 · Free to use"
    />
  );
}
