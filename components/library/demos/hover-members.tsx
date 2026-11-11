"use client";

import { HoverMembers } from "../hover-members/hover-members";

/** Public-domain portraits, via Wikimedia Commons. */
export default function HoverMembersDemo() {
  return (
    <div className="w-full rounded-2xl bg-white px-4 py-10 text-neutral-900">
      <HoverMembers
        title="Physics"
        members={[
          { name: "Feynman", role: "Quantum electrodynamics", image: "/people/feynman.jpg" },
          { name: "Curie", role: "Radioactivity", image: "/people/curie.jpg" },
          { name: "Einstein", role: "Relativity", image: "/people/einstein.jpg" },
          { name: "Bohr", role: "Atomic structure", image: "/people/bohr.jpg" },
          { name: "Dirac", role: "Quantum mechanics", image: "/people/dirac.jpg" },
          { name: "Tesla", role: "Alternating current", image: "/people/tesla.jpg" },
        ]}
      />
    </div>
  );
}
