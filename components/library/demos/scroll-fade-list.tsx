"use client";

import { ScrollFadeList } from "../scroll-fade-list/scroll-fade-list";

const people = [
  "Amira Hassan", "Omar Khaled", "Lina Farouk", "Youssef Adel", "Salma Nabil", "Karim Mostafa",
  "Nour Ibrahim", "Mariam Tarek", "Hassan Ali", "Farida Samir", "Ziad Hany", "Laila Mahmoud",
];

export default function ScrollFadeListDemo() {
  return (
    <div className="w-72 rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <p className="px-2 pb-2 pt-1 text-xs font-medium text-neutral-500">Team · {people.length}</p>
      <ScrollFadeList maxHeight={240}>
        <ul>
          {people.map((p) => (
            <li key={p} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
              <span className="flex size-7 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                {p.split(" ").map((w) => w[0]).join("")}
              </span>
              <span className="text-neutral-800 dark:text-neutral-200">{p}</span>
            </li>
          ))}
        </ul>
      </ScrollFadeList>
    </div>
  );
}
