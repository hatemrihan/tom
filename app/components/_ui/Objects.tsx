import Link from "next/link";
import { PreviewFrame } from "./PreviewFrame";

export interface ObjectEntry {
  slug: string;
  name: string;
}

/** A quiet shelf of components: no frames, no copy, just the objects. */
export function Objects({ entries, total }: { entries: ObjectEntry[]; total: number }) {
  return (
    <section className="mx-auto w-full max-w-[1040px] px-6 pb-10 pt-6">
      <div className="text-center text-[11px] font-medium uppercase leading-[1.25] tracking-[0.01em]">
        <h2>Collected components</h2>
        <p className="font-normal text-neutral-500">
          {entries.length} of {total}
        </p>
      </div>

      <ul className="mt-16 grid grid-cols-3 gap-x-6 gap-y-14 sm:grid-cols-4 md:mt-24 md:grid-cols-6 md:gap-y-20">
        {entries.map((e) => (
          <li key={e.slug}>
            <Link href={`/components/${e.slug}`} className="group relative block outline-none">
              <div className="pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-focus-visible:scale-110">
                <PreviewFrame slug={e.slug} height={104} replay={false} compact bare />
              </div>
              <span className="absolute inset-x-0 -bottom-7 text-center text-[10px] font-medium uppercase tracking-[0.02em] text-neutral-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                {e.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
