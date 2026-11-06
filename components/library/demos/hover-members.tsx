"use client";

import { HoverMembers } from "../hover-members/hover-members";

export default function HoverMembersDemo() {
  return (
    <div className="w-full rounded-2xl bg-neutral-950 px-4 py-10 text-white">
      <HoverMembers
        title="TOM Studio"
        members={[
          { name: "Hatem", role: "Design engineer", image: "/images/hatem-image.jpg" },
          { name: "Jayash", role: "Client · Branding", image: "/images/JayashOne-image.jpg" },
          { name: "Unlimited", role: "Client · E‑commerce", image: "/images/UnlimitedOne-image.jpg" },
          { name: "Farag", role: "Client · Photography", image: "/images/FaragOne-image.png" },
          { name: "Nader", role: "Client · Coaching", image: "/images/NaderOne-image.png" },
          { name: "Atelier", role: "Packaging", image: "/images/JayashThree-image.png" },
          { name: "Archive", role: "Art direction", image: "/images/FaragThree-image.png" },
        ]}
      />
    </div>
  );
}
