"use client";

import { ProjectIndex } from "../project-index/project-index";

/** Nobel laureates in physics. Portraits are public domain, via Wikimedia Commons. */
export default function ProjectIndexDemo() {
  return (
    <div className="w-full rounded-2xl bg-white p-6 text-neutral-900">
      <ProjectIndex
        projects={[
          { name: "Richard Feynman", image: "/people/feynman.jpg", meta: "Quantum electrodynamics, 1965" },
          { name: "Marie Curie", image: "/people/curie.jpg", meta: "Radioactivity, 1903" },
          { name: "Albert Einstein", image: "/people/einstein.jpg", meta: "Photoelectric effect, 1921" },
          { name: "Niels Bohr", image: "/people/bohr.jpg", meta: "Atomic structure, 1922" },
          { name: "Paul Dirac", image: "/people/dirac.jpg", meta: "Quantum mechanics, 1933" },
        ]}
      />
    </div>
  );
}
