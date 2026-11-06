"use client";

import { ExpandOnHover } from "../expand-on-hover/expand-on-hover";

export default function ExpandOnHoverDemo() {
  return (
    <ExpandOnHover
      className="max-w-2xl"
      items={[
        { src: "/images/JayashOne-image.jpg", title: "Jayash", subtitle: "E‑commerce · Branding" },
        { src: "/images/UnlimitedOne-image.jpg", title: "Unlimited", subtitle: "E‑commerce · Next.js" },
        { src: "/images/FaragOne-image.png", title: "Farag", subtitle: "Photography studio" },
        { src: "/images/NaderOne-image.png", title: "NE Coach", subtitle: "Coaching platform" },
      ]}
    />
  );
}
