import { ExpandColumns } from "../expand-columns/expand-columns";

/** Public-domain portraits, via Wikimedia Commons. Years are Nobel Prizes, or the year of the photograph. */
export default function ExpandColumnsDemo() {
  return (
    <div className="w-full rounded-2xl bg-white p-4 text-neutral-900">
      <ExpandColumns
        defaultIndex={3}
        items={[
          { title: "Marie Curie", meta: "1903", image: "/people/curie.jpg" },
          { title: "Albert Einstein", meta: "1921", image: "/people/einstein.jpg" },
          { title: "Niels Bohr", meta: "1922", image: "/people/bohr.jpg" },
          { title: "Richard Feynman", meta: "1965", image: "/people/feynman.jpg" },
          { title: "Paul Dirac", meta: "1933", image: "/people/dirac.jpg" },
          { title: "Erwin Schrödinger", meta: "1933", image: "/people/schrodinger.jpg" },
          { title: "Robert Oppenheimer", meta: "1947", image: "/people/oppenheimer.jpg" },
          { title: "Nikola Tesla", meta: "1890", image: "/people/tesla.jpg" },
        ]}
      />
    </div>
  );
}
