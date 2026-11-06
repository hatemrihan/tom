"use client";

import { ExpandableTabs } from "../expandable-tabs/expandable-tabs";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export default function ExpandableTabsDemo() {
  return (
    <ExpandableTabs
      tabs={[
        { label: "Home", icon: icon("M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z") },
        { label: "Projects", icon: icon("M3 7h18M3 12h18M3 17h12") },
        { label: "Components", icon: icon("M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z") },
        "separator",
        { label: "Inbox", icon: icon("M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z") },
        { label: "Settings", icon: icon("M12 15a3 3 0 100-6 3 3 0 000 6z") },
      ]}
    />
  );
}
