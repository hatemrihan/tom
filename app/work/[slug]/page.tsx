import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { srcSet, work } from "@/lib/work";
import { registry } from "@/components/library/registry";
import { DocsNav } from "../../components/_ui/DocsNav";
import { WorkWithMe } from "../../components/_ui/DocsChrome";

export function generateStaticParams() {
  return work.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = work.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — work`,
    description: project.description,
    alternates: { canonical: `/work/${slug}` },
  };
}

export default async function WorkPage({ params }: Params) {
  const { slug } = await params;
  const index = work.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = work[index];
  const next = work[(index + 1) % work.length];

  return (
    <>
    <DocsNav count={registry.length} theme={false} surface="bg-white/85" />
    <main className="min-h-dvh bg-white px-6 pb-28 pt-6 text-[11px] font-medium uppercase leading-[1.35] tracking-[0.01em] text-neutral-900 sm:px-10">
      <div className="mx-auto max-w-[1400px]">
        <nav className="flex items-center justify-between">
          <Link href="/work" className="underline-offset-4 hover:underline">
            ← Work
          </Link>
          <span className="font-normal text-neutral-500">
            {String(index + 1).padStart(2, "0")}/{String(work.length).padStart(2, "0")}
          </span>
        </nav>

        {/* the story: description on the left, facts on the right */}
        <header className="mx-auto mt-24 max-w-3xl">
          <h1>{project.name}</h1>
          <div className="mt-4 grid gap-x-10 gap-y-4 text-[12px] font-normal normal-case leading-[1.45] tracking-normal sm:grid-cols-2">
            <p>{project.description}</p>
            <dl className="space-y-1">
              {project.facts.map((f) => (
                <div key={f.label} className="flex gap-4">
                  <dt className="w-14 shrink-0 text-neutral-500">{f.label}</dt>
                  <dd>
                    {f.label === "Live" && project.url ? (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                        {f.value} ↗
                      </a>
                    ) : (
                      f.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        {/* the longer account, for projects that have one */}
        {project.story && (
          <section className="mx-auto mt-16 grid max-w-3xl gap-x-10 gap-y-8 sm:grid-cols-2" aria-label="About the project">
            {project.story.map((part) => (
              <div key={part.title}>
                <h2 className="text-neutral-500">{part.title}</h2>
                <p className="mt-2 text-[12px] font-normal normal-case leading-[1.45] tracking-normal">{part.text}</p>
              </div>
            ))}
          </section>
        )}

        {/* every screen, large, one under another */}
        <section className="mx-auto mt-24 flex max-w-[1100px] flex-col items-center gap-10 md:gap-16" aria-label="Screens">
          {project.shots.map((shot, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={shot.src}
              src={shot.src}
              srcSet={srcSet(shot)}
              sizes="(min-width: 1180px) 1100px, 100vw"
              alt={`${project.name}, screen ${i + 1}`}
              width={shot.width}
              height={shot.height}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="h-auto w-full shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
            />
          ))}
        </section>

        <footer className="mt-40 text-center">
          <p className="font-normal text-neutral-500">Next</p>
          <Link href={`/work/${next.slug}`} className="underline-offset-4 hover:underline">
            {next.name} →
          </Link>
        </footer>

        <WorkWithMe />
      </div>
    </main>
    </>
  );
}
