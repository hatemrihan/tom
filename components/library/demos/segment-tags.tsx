import { SegmentTags } from "../segment-tags/segment-tags";

/** Any mark works; this is the TOM dog. */
const mark = (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 57c-4-9-5-22-1-32 4-11 16-14 23-6 2 3 4 5 9 6 5 1 7 4 7 8s-3 6-8 6c-6 0-9 2-10 6-1 4 0 8 2 12" />
    <path d="M27 17c-11-2-17 8-15 21 1 7 9 7 11-1 1-6 1-12 4-20Z" />
    <circle cx="56.5" cy="31.5" r="4" fill="currentColor" stroke="none" />
  </svg>
);

export default function SegmentTagsDemo() {
  return (
    <div className="flex flex-col items-start gap-8">
      <div className="flex flex-wrap items-center gap-8">
        <SegmentTags mark={mark} segments={[{ label: "Research\nGrants", href: "#" }]} />
        <SegmentTags
          mark={mark}
          color="#1f5f63"
          ink="#dfe9ea"
          segments={[{ label: "Nobel\nLectures", href: "#" }, { image: "/people/feynman.jpg", alt: "Richard Feynman" }]}
        />
      </div>
      <SegmentTags
        mark={mark}
        color="#eeff00"
        ink="#a9a9ad"
        segments={[
          { label: "Product\nInformation", href: "#" },
          { label: "Function\nOverview", href: "#" },
          { label: "Efficiency\nReport", href: "#" },
          { label: "More\nInformation", href: "#" },
        ]}
      />
    </div>
  );
}
