"use client";

import { CommandPalette } from "../command-palette/command-palette";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export default function CommandPaletteDemo() {
  return (
    <CommandPalette
      inline
      commands={[
        { id: "home", label: "Go to home", group: "Navigation", shortcut: "G H", icon: icon("M3 10l9-7 9 7v10H3z") },
        { id: "components", label: "Browse components", group: "Navigation", shortcut: "G C", icon: icon("M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z") },
        { id: "contact", label: "Contact Hatem", group: "Navigation", icon: icon("M4 4h16v16H4zM4 4l8 8 8-8") },
        { id: "theme", label: "Toggle theme", group: "Preferences", shortcut: "⌘ J", icon: icon("M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z") },
        { id: "copy", label: "Copy page link", group: "Actions", shortcut: "⌘ L", icon: icon("M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7") },
        { id: "github", label: "Open GitHub", group: "Actions", keywords: ["source", "code"], icon: icon("M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 00-1-2.6c3.1-.4 6.5-1.5 6.5-7a5.4 5.4 0 00-1.5-3.8 5 5 0 00-.1-3.8s-1.2-.4-3.9 1.5a13.4 13.4 0 00-7 0C6.3 1.5 5.1 1.9 5.1 1.9a5 5 0 00-.1 3.8A5.4 5.4 0 003.5 9.5c0 5.4 3.3 6.6 6.4 7a3.4 3.4 0 00-1 2.6V23") },
      ]}
    />
  );
}
