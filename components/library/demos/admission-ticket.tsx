"use client";

import { AdmissionTicket } from "../admission-ticket/admission-ticket";

/** Any logo works; this is the TOM dog. */
const logo = (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 57c-4-9-5-22-1-32 4-11 16-14 23-6 2 3 4 5 9 6 5 1 7 4 7 8s-3 6-8 6c-6 0-9 2-10 6-1 4 0 8 2 12" />
    <path d="M27 17c-11-2-17 8-15 21 1 7 9 7 11-1 1-6 1-12 4-20Z" />
    <circle cx="40" cy="27" r="2" fill="currentColor" stroke="none" />
    <circle cx="56.5" cy="31.5" r="4" fill="currentColor" stroke="none" />
  </svg>
);

export default function AdmissionTicketDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <AdmissionTicket
        logo={logo}
        venue={"TOM Museum\nof Small Interfaces"}
        number="000 114 351"
        date="11-11-26"
        kind="General ticket"
        time="14.00 to 16.00"
        qr="https://tomm.one/components/admission-ticket"
      />
      <AdmissionTicket
        logo={logo}
        venue={"TOM Museum\nof Small Interfaces"}
        number="000 114 352"
        date="11-11-26"
        kind="Student ticket"
        time="14.00 to 16.00"
        qr="https://tomm.one/components/admission-ticket"
        accent="#dfe6f7"
        onAccent="#2a3f96"
      />
    </div>
  );
}
