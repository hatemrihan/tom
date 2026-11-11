"use client";

import { ScrollColorList } from "../scroll-color-list/scroll-color-list";

/** Nobel laureates in physics. Portraits are public domain, via Wikimedia Commons. */
export default function ScrollColorListDemo() {
  return (
    <div className="h-[560px] w-full overflow-hidden rounded-2xl">
      <ScrollColorList
        tick
        items={[
          { title: "Feynman", tag: "Quantum electrodynamics", meta: "1965", color: "#f1efe9", image: "/people/feynman.jpg" },
          { title: "Curie", tag: "Radioactivity", meta: "1903", color: "#e9ecee", image: "/people/curie.jpg" },
          { title: "Einstein", tag: "Photoelectric effect", meta: "1921", color: "#efe9e4", image: "/people/einstein.jpg" },
          { title: "Bohr", tag: "Atomic structure", meta: "1922", color: "#e8ebe6", image: "/people/bohr.jpg" },
          { title: "Dirac", tag: "Quantum mechanics", meta: "1933", color: "#ececec", image: "/people/dirac.jpg" },
          { title: "Schrödinger", tag: "Wave mechanics", meta: "1933", color: "#f0ede6", image: "/people/schrodinger.jpg" },
        ]}
      />
    </div>
  );
}
