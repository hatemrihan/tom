"use client";

import { ProjectIndex } from "../project-index/project-index";

export default function ProjectIndexDemo() {
  return (
    <div className="w-full rounded-2xl bg-neutral-950 p-6">
      <ProjectIndex
        projects={[
          { name: "Jayash Atelier", image: "/images/JayashOne-image.jpg", meta: "Branding · 2024", href: "https://jayashatelier.com" },
          { name: "Unlimited", image: "/images/UnlimitedOne-image.jpg", meta: "E‑commerce · 2024", href: "https://unlimited-sw.com" },
          { name: "Farag Studio", image: "/images/FaragOne-image.png", meta: "Photography · 2023", href: "https://faragg.netlify.app" },
          { name: "NE Coaching", image: "/images/NaderOne-image.png", meta: "Platform · 2024", href: "https://nader-emad.vercel.app" },
          { name: "TOM Components", image: "/images/hatem-image.jpg", meta: "Open source · 2026" },
        ]}
      />
    </div>
  );
}
