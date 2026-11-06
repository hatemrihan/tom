"use client";

import { ExpandableCards } from "../expandable-cards/expandable-cards";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" className="size-full" fill="currentColor" aria-hidden>
    <path d={d} />
  </svg>
);

export default function ExpandableCardsDemo() {
  return (
    <ExpandableCards
      cards={[
        {
          id: "projects", title: "Projects", value: "12 shipped", color: "#a855f7",
          icon: icon("M12 2l2.4 6.9H22l-6 4.6 2.3 7.1L12 16.3 5.7 20.6 8 13.5 2 8.9h7.6z"),
          details: [{ label: "This year", value: "5" }, { label: "In progress", value: "2" }],
        },
        {
          id: "clients", title: "Clients", value: "9 brands", color: "#171717",
          icon: icon("M6 3h12v18l-6-4-6 4z"),
          details: [{ label: "Egypt", value: "6" }, { label: "Abroad", value: "3" }],
        },
        {
          id: "components", title: "Components", value: "50+ open", color: "#06b6d4",
          icon: icon("M6.5 19a4.5 4.5 0 01-.42-8.98A6 6 0 0117.7 8.5 4.5 4.5 0 0117.5 19z"),
          details: [{ label: "License", value: "MIT" }, { label: "Stack", value: "React · TS" }],
        },
        {
          id: "coffee", title: "Coffee", value: "∞ cups", color: "#3b82f6",
          icon: icon("M4 8h13v5a5 5 0 01-5 5H9a5 5 0 01-5-5zM17 9h2a2 2 0 010 4h-2"),
          details: [{ label: "Today", value: "3" }, { label: "Favourite", value: "Flat white" }],
        },
      ]}
    />
  );
}
