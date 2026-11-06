import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { registry } from "@/components/library/registry";
import { getResolvedRegistry } from "@/lib/component-settings";
import { CN_SOURCE, loadSource } from "@/lib/component-source";
import { site } from "@/lib/site";
import { Frame } from "../_ui/ComponentGrid";
import { PreviewFrame } from "../_ui/PreviewFrame";
import { CodeTabs, CopyButton, type CodeFile } from "../_ui/CodeTabs";
import { DocsHeader, WorkWithMe } from "../_ui/DocsChrome";
import { codeToHtml } from "shiki";

export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return registry.map((e) => ({ slug: e.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = (await getResolvedRegistry({ includeHidden: true })).find((e) => e.slug === slug);
  if (!entry) return {};
  return {
    title: entry.name,
    description: `${entry.description} Free, open-source React + Tailwind component.`,
    alternates: { canonical: `/components/${slug}` },
    openGraph: { title: `${entry.name} — TOM Components`, description: entry.description, url: `/components/${slug}` },
  };
}

export default async function ComponentPage({ params }: Params) {
  const { slug } = await params;
  const all = await getResolvedRegistry();
  const index = all.findIndex((e) => e.slug === slug);
  if (index === -1) notFound();
  const entry = all[index];
  const prev = all[(index - 1 + all.length) % all.length];
  const next = all[(index + 1) % all.length];

  const sources = await Promise.all([...entry.files, `demos/${slug}.tsx`].map(loadSource));
  const files: CodeFile[] = sources.map((s, i) => ({
    label: i === sources.length - 1 ? "Usage" : s.name,
    target: s.target,
    code: s.code,
    html: s.html,
  }));
  const cnHtml = await codeToHtml(CN_SOURCE, { lang: "ts", themes: { light: "github-light", dark: "github-dark-default" }, defaultColor: false });
  const installCmd = `npm i ${entry.dependencies.join(" ")}`;

  return (
    <main className="mx-auto w-full max-w-[880px] px-4 pb-40 sm:px-6">
      <DocsHeader />

      <Link href="/components" className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition hover:text-neutral-900 dark:hover:text-white">
        <ArrowLeft className="size-4" /> All components
      </Link>

      <div className="mb-6 px-1">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">{entry.category}</p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">{entry.name}</h1>
        <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-neutral-500">{entry.description}</p>
      </div>

      <Frame>
        <div className="rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          <PreviewFrame slug={slug} height={entry.previewHeight ?? 340} />
        </div>
      </Frame>

      <section className="mt-12">
        <h2 className="mb-3 px-1 text-[15px] font-medium">Installation</h2>
        <ol className="space-y-6">
          <Step n={1} title="Install dependencies">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200/80 bg-white py-1.5 pl-4 pr-1.5 font-mono text-[13px] dark:border-neutral-800 dark:bg-neutral-950">
              <span className="truncate">
                <span className="select-none text-neutral-400">$ </span>
                {installCmd}
              </span>
              <CopyButton text={installCmd} />
            </div>
          </Step>
          <Step n={2} title="Add the cn helper" hint="lib/utils.ts — skip if you use shadcn/ui, it's the same.">
            <CodeTabs files={[{ label: "utils.ts", target: "lib/utils.ts", code: CN_SOURCE, html: cnHtml }]} />
          </Step>
          <Step n={3} title="Copy the component" hint="Paste each file at the path shown above it.">
            <CodeTabs files={files} />
          </Step>
        </ol>
      </section>

      {(entry.notes?.length || entry.inspiration || sources[0].code.includes("container?: RefObject")) && (
        <section className="mt-12">
          <h2 className="mb-3 px-1 text-[15px] font-medium">Notes</h2>
          <ul className="space-y-2 rounded-2xl border border-neutral-200/80 bg-white p-5 text-sm leading-relaxed text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
            {[
              ...(entry.notes ?? []),
              ...(sources[0].code.includes("container?: RefObject")
                ? ["Inside your own scroll area? Pass its ref as `container` and give that element `position: relative` so scroll offsets measure correctly."]
                : []),
            ].map((n) => (
              <li key={n} className="flex gap-2">
                <span className="text-neutral-300">—</span>
                <span>{n}</span>
              </li>
            ))}
            <li className="flex gap-2">
              <span className="text-neutral-300">—</span>
              <span>Respects reduced-motion where it matters and works with keyboard and touch.</span>
            </li>
            {entry.inspiration && (
              <li className="flex gap-2">
                <span className="text-neutral-300">—</span>
                <span>
                  Pattern inspired by{" "}
                  <a href={entry.inspiration.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-neutral-900 underline-offset-4 hover:underline dark:text-white">
                    {entry.inspiration.label} <ArrowUpRight className="size-3" />
                  </a>
                  . This implementation is original and MIT licensed.
                </span>
              </li>
            )}
          </ul>
        </section>
      )}

      <nav className="mt-12 grid grid-cols-2 gap-2">
        <Link href={`/components/${prev.slug}`} className="group rounded-2xl border border-neutral-200/80 bg-white p-4 transition hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900">
          <span className="flex items-center gap-1 text-xs text-neutral-400">
            <ArrowLeft className="size-3 transition group-hover:-translate-x-0.5" /> Previous
          </span>
          <span className="mt-1 block truncate text-sm font-medium">{prev.name}</span>
        </Link>
        <Link href={`/components/${next.slug}`} className="group rounded-2xl border border-neutral-200/80 bg-white p-4 text-right transition hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900">
          <span className="flex items-center justify-end gap-1 text-xs text-neutral-400">
            Next <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
          </span>
          <span className="mt-1 block truncate text-sm font-medium">{next.name}</span>
        </Link>
      </nav>

      <a
        href={`${site.github}/tree/main/components/library/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-400 transition hover:text-neutral-900 dark:hover:text-white"
      >
        <Github className="size-3.5" /> View source on GitHub
      </a>

      <WorkWithMe />
    </main>
  );
}

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <li className="relative pl-10">
      <span className="absolute left-0 top-0 flex size-6 items-center justify-center rounded-full border border-neutral-200 bg-white text-xs tabular-nums text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
        {n}
      </span>
      <p className="text-sm font-medium leading-6">{title}</p>
      {hint && <p className="mb-2 text-xs text-neutral-500">{hint}</p>}
      <div className={hint ? "" : "mt-2"}>{children}</div>
    </li>
  );
}
