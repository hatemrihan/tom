import Link from "next/link";
import { srcSet, work } from "@/lib/work";

/** A torn strip of masking tape, slightly different on each print. */
const TAPE = [
  "polygon(4% 8%, 22% 0, 55% 5%, 96% 2%, 100% 34%, 93% 62%, 78% 100%, 30% 96%, 9% 70%, 0 40%)",
  "polygon(0 6%, 40% 0, 72% 6%, 100% 0, 96% 48%, 100% 92%, 58% 100%, 22% 94%, 3% 100%, 6% 50%)",
];

/**
 * The work, one project at a time, like a small print taped to a wall with
 * a typed label up to its right. The whole block links to the project.
 */
export default function Work() {
  return (
    <section id="work" className="bg-white px-6 py-32 sm:px-10">
      <h2 className="sr-only">Work</h2>

      <ul className="space-y-56">
        {work.map((project, i) => {
          const cover = project.cover ?? project.shots[0];
          const kind = project.facts.find((f) => f.label === "Work")?.value;
          const live = project.facts.find((f) => f.label === "Live")?.value;
          return (
            <li key={project.slug} className="flex justify-center">
              {/* the print sits a little left of centre; its label hangs up and to the right */}
              <Link href={`/work/${project.slug}`} className="group relative block w-[230px] outline-none md:w-[320px] md:-translate-x-[60%]">
                <span
                  aria-hidden
                  className="absolute left-1/2 top-0 z-10 h-12 w-[72px] -translate-x-1/2 -translate-y-[58%] bg-[#f3e9a2]/90 shadow-[0_1px_1px_rgba(0,0,0,0.06)]"
                  style={{ clipPath: TAPE[i % TAPE.length], rotate: `${i % 2 ? 3 : -4}deg` }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover.src}
                  srcSet={srcSet(cover)}
                  sizes="(min-width: 768px) 320px, 230px"
                  alt=""
                  width={cover.width}
                  height={cover.height}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full shadow-[0_1px_2px_rgba(0,0,0,0.14)]"
                />
                <p className="mt-5 text-right text-[11px] font-medium uppercase leading-[1.3] tracking-[0.01em] text-[#e3342a] md:absolute md:bottom-[calc(100%+2.5rem)] md:left-[calc(100%+5rem)] md:mt-0 md:whitespace-nowrap">
                  <span className="underline-offset-4 group-hover:underline group-focus-visible:underline">{project.name}</span>
                  <br />
                  {kind}
                  {live && (
                    <>
                      <br />
                      {live}
                    </>
                  )}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
