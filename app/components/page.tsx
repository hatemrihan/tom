import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { CATEGORIES } from "@/components/library/registry";
import { getResolvedRegistry } from "@/lib/component-settings";
import { site } from "@/lib/site";
import { ComponentCard, ComponentGrid, Frame, type GridEntry } from "./_ui/ComponentGrid";
import { PreviewFrame } from "./_ui/PreviewFrame";
import { DocsHeader, WorkWithMe } from "./_ui/DocsChrome";

export const revalidate = 60;

export default async function ComponentsPage() {
  const entries = await getResolvedRegistry();
  const toGrid = (e: (typeof entries)[number]): GridEntry => ({
    slug: e.slug,
    name: e.name,
    description: e.description,
    category: e.category,
    added: e.added,
  });
  const featured = entries.filter((e) => e.featured).slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-[1120px] px-4 pb-40 sm:px-6">
      <DocsHeader />

      {/* Intro */}
      <Frame className="mt-2">
        <div className="grid gap-2 md:grid-cols-2">
          <div className="flex flex-col justify-center rounded-2xl border border-neutral-200/80 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-950 md:p-10">
            <p className="text-[15px] font-medium">Open-source components</p>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-neutral-500">
              {entries.length} interaction patterns, visual experiments and everyday UI pieces — written in TypeScript, styled
              with Tailwind, animated with Motion. Copy them, learn from them, ship them.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="#all"
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-neutral-900 px-3.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                Browse all <ArrowRight className="size-4" />
              </a>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 text-sm text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900"
              >
                <Github className="size-4" /> Source on GitHub
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            <PreviewFrame slug="signature" height={264} />
          </div>
        </div>
      </Frame>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mt-20">
          <SectionTitle title="What's cooking" subtitle="Fresh interaction patterns, component ideas and visual experiments." />
          <Frame>
            <div className="grid gap-2 md:grid-cols-3">
              {featured.map((e) => (
                <ComponentCard key={e.slug} entry={toGrid(e)} />
              ))}
            </div>
            <a
              href="#all"
              className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-neutral-200/80 bg-white px-3 text-[15px] transition hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900"
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-neutral-900 text-xs tabular-nums text-white dark:bg-white dark:text-neutral-900">
                {entries.length}
              </span>
              View all components
              <ArrowRight className="ml-auto size-4 text-neutral-400" />
            </a>
          </Frame>
        </section>
      )}

      {/* All */}
      <section id="all" className="mt-20 scroll-mt-8">
        <SectionTitle title="All components" subtitle="Filter by category or search by name." />
        <ComponentGrid entries={entries.map(toGrid)} categories={CATEGORIES} />
      </section>

      <section className="mt-20">
        <SectionTitle title="Using them" subtitle="No package to install yet — every component is a single file you own." />
        <Frame>
          <div className="grid gap-2 md:grid-cols-3">
            {[
              ["1. Install the basics", "npm i motion clsx tailwind-merge"],
              ["2. Add the cn helper", "lib/utils.ts — shown on every page"],
              ["3. Copy the component", "Paste it into components/tom/"],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-neutral-200/80 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
                <p className="text-sm font-medium">{t}</p>
                <p className="mt-1 font-mono text-xs text-neutral-500">{d}</p>
              </div>
            ))}
          </div>
        </Frame>
      </section>

      <WorkWithMe />

      <p className="mt-10 text-center text-xs text-neutral-400">
        MIT licensed · Built by{" "}
        <Link href="/" className="underline-offset-4 hover:text-neutral-900 hover:underline dark:hover:text-white">
          {site.author}
        </Link>
      </p>
    </main>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4 px-1">
      <h2 className="text-[17px] font-medium tracking-tight">{title}</h2>
      <p className="text-[15px] text-neutral-500">{subtitle}</p>
    </div>
  );
}
