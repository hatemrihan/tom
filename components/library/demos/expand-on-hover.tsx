import { ExpandOnHover } from "../expand-on-hover/expand-on-hover";

/** Nobel laureates in physics. Portraits are public domain, via Wikimedia Commons. */
export default function ExpandOnHoverDemo() {
  return (
    <ExpandOnHover
      className="max-w-2xl"
      items={[
        { src: "/people/feynman.jpg", title: "Richard Feynman", subtitle: "Quantum electrodynamics, 1965" },
        { src: "/people/curie.jpg", title: "Marie Curie", subtitle: "Radioactivity, 1903" },
        { src: "/people/einstein.jpg", title: "Albert Einstein", subtitle: "Photoelectric effect, 1921" },
        { src: "/people/bohr.jpg", title: "Niels Bohr", subtitle: "Atomic structure, 1922" },
      ]}
    />
  );
}
