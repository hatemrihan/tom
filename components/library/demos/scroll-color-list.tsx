"use client";

import { ScrollColorList } from "../scroll-color-list/scroll-color-list";

export default function ScrollColorListDemo() {
  return (
    <div className="h-[460px] w-full overflow-hidden rounded-2xl">
      <ScrollColorList
        tick
        items={[
          { title: "Jayash Atelier", tag: "Branding", meta: "2024", color: "#4fb3d1", image: "/images/JayashOne-image.jpg", href: "https://jayashatelier.com" },
          { title: "Unlimited", tag: "E‑commerce", meta: "2024", color: "#c7e3ee", image: "/images/UnlimitedOne-image.jpg", href: "https://unlimited-sw.com" },
          { title: "Farag Studio", tag: "Photography", meta: "2023", color: "#e9e4d8", image: "/images/FaragOne-image.png", href: "https://faragg.netlify.app" },
          { title: "NE Coaching", tag: "Platform", meta: "2024", color: "#a3d8cf", image: "/images/NaderOne-image.png", href: "https://nader-emad.vercel.app" },
          { title: "TOM Components", tag: "Open source", meta: "2026", color: "#f2d4c4", image: "/images/hatem-image.jpg" },
          { title: "Jayash Merch", tag: "Packaging", meta: "2024", color: "#d9d2f0", image: "/images/JayashThree-image.png" },
          { title: "Unlimited Data", tag: "Interface", meta: "2024", color: "#cfe8b8", image: "/images/UnlimitedThree-image.png" },
          { title: "Farag Archive", tag: "Art direction", meta: "2023", color: "#f0e6a8", image: "/images/FaragThree-image.png" },
        ]}
      />
    </div>
  );
}
