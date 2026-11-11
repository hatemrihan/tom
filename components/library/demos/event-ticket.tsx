"use client";

import { EventTicket } from "../event-ticket/event-ticket";

const venue = { label: "Venue", value: "Studio 4" };

export default function EventTicketDemo() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-5">
      <EventTicket
        kicker="TOM talks"
        title="The grammar of motion"
        day="19"
        month="November 2026"
        details={[{ label: "Day", value: "Thursday" }, { label: "Doors", value: "19.00" }, venue, { label: "Seat", value: "B 12" }]}
        number="000 114 351"
        qr="https://tomm.one/components/event-ticket"
      />
      <EventTicket
        kicker="TOM talks"
        title="Small interfaces, made by hand"
        day="20"
        month="November 2026"
        details={[{ label: "Day", value: "Friday" }, { label: "Doors", value: "19.00" }, venue, { label: "Seat", value: "B 13" }]}
        number="000 114 352"
        qr="https://tomm.one/components"
        color="#1c1917"
      />
      <EventTicket
        kicker="TOM talks"
        title="Type that behaves"
        day="21"
        month="November 2026"
        details={[{ label: "Day", value: "Saturday" }, { label: "Doors", value: "18.00" }, venue, { label: "Seat", value: "B 14" }]}
        number="000 114 353"
        qr="https://tomm.one"
        color="#dfe6f7"
        onColor="#2a3f96"
      />
    </div>
  );
}
