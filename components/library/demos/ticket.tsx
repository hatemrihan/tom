"use client";

import { Ticket, TicketSection } from "../ticket/ticket";

export default function TicketDemo() {
  return (
    <Ticket>
      <TicketSection>
        <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">Admit one</p>
        <p className="mt-1 text-xl font-semibold tracking-tight">Design Engineering Night</p>
        <p className="text-sm text-neutral-500">Cairo · Studio 4</p>
      </TicketSection>
      <TicketSection className="grid grid-cols-3 gap-2 text-xs">
        {[
          ["Date", "Nov 21"],
          ["Doors", "19:00"],
          ["Seat", "B‑12"],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-neutral-400">{k}</p>
            <p className="font-medium">{v}</p>
          </div>
        ))}
      </TicketSection>
      <TicketSection className="flex items-center justify-between">
        <span className="font-mono text-xs text-neutral-400">#TOM‑0042</span>
        <span className="flex h-8 items-stretch gap-px">
          {[2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2].map((w, i) => (
            <span key={i} className="bg-current" style={{ width: w }} />
          ))}
        </span>
      </TicketSection>
    </Ticket>
  );
}
