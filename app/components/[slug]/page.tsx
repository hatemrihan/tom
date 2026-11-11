import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { registry } from "@/components/library/registry";
import { getResolvedRegistry } from "@/lib/component-settings";
import { loadFlutterSource, loadSource } from "@/lib/component-source";
import { site } from "@/lib/site";
import { PreviewFrame } from "../_ui/PreviewFrame";
import { CodeTabs, CopyButton, type CodeFile } from "../_ui/CodeTabs";
import { WorkWithMe } from "../_ui/DocsChrome";
import { Editions } from "../_ui/Editions";

const NPM_INSTALL = "npm i tomm-ui";
const PUB_INSTALL = "flutter pub add tomm";
const DART_IMPORT = "import 'package:tomm/tomm.dart';";

export const revalidate = 60;
export const dynamicParams = true;

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
    description: `${entry.description} Free and open source, for React and Flutter.`,
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
  const usage = sources[sources.length - 1];
  const usageFile: CodeFile[] = [{ label: "example.tsx", target: usage.target, code: usage.code, html: usage.html }];
  const files: CodeFile[] = sources.slice(0, -1).map((s) => ({ label: s.name, target: s.target, code: s.code, html: s.html }));

  // Flutter edition: the widget, plus the shared files it imports.
  const dart: CodeFile[] = [];
  if (entry.flutter) {
    const main = await loadFlutterSource(entry.flutter);
    const shared = [...main.code.matchAll(/^import '([a-z_]+\.dart)';/gm)].map((m) => m[1]);
    const dartFiles = [main, ...(await Promise.all(shared.map(loadFlutterSource)))];
    dart.push(...dartFiles.map((f) => ({ label: f.name, target: f.target, code: f.code, html: f.html })));
  }

  const reactSteps = (
    <ol className="space-y-8">
      <Step n={1} title="Install" hint="One package. Its styles and everything it needs come with it.">
        <Command text={NPM_INSTALL} prompt />
      </Step>
      <Step n={2} title="Use it">
        <CodeTabs files={usageFile} />
      </Step>
      <Step n={3} title="Or own the code" hint="Copies the source into your project, yours to change.">
        <div className="space-y-3">
          <Command text={`npx tomm-ui add ${slug}`} prompt />
          <CodeTabs files={files} />
        </div>
      </Step>
    </ol>
  );

  const flutterSteps = (
    <ol className="space-y-8">
      <Step n={1} title="Install" hint="One package. Everything it needs comes with it.">
        <Command text={PUB_INSTALL} prompt />
      </Step>
      <Step n={2} title="Import">
        <Command text={DART_IMPORT} />
      </Step>
      <Step n={3} title="Or own the code" hint="Copies the source into your app, yours to change. The preview above shows the React edition.">
        <div className="space-y-3">
          <Command text={`dart run tomm add ${slug.replace(/-/g, "_")}`} prompt />
          <CodeTabs files={dart} />
        </div>
      </Step>
    </ol>
  );

  return (
    <main className="w-full max-w-[920px] pb-24 pt-8">
      <Link href="/components#all" className="mb-6 inline-block text-neutral-400 transition hover:text-neutral-900 dark:hover:text-white lg:hidden">
        ← All components
      </Link>

      <div className="mb-5">
        <p className="font-normal text-neutral-400">{entry.category}</p>
        <h1 className="text-neutral-900 dark:text-white">{entry.name}</h1>
        <p className="max-w-md font-normal text-neutral-500">{entry.description}</p>
      </div>

      <PreviewFrame slug={slug} height={entry.previewHeight ?? 340} align={entry.previewAlign} />

      {dart.length > 0 ? (
        <Editions react={reactSteps} flutter={flutterSteps} />
      ) : (
        <section className="mt-16">
          <h2 className="mb-6 text-neutral-900 dark:text-white">Use it</h2>
          {reactSteps}
        </section>
      )}

      <section className="mt-16">
        <h2 className="mb-3 text-neutral-900 dark:text-white">Notes</h2>
        <ul className="max-w-xl space-y-1.5 font-normal text-neutral-500">
          {[
            ...(entry.notes ?? []),
            ...(sources[0].code.includes("container?: RefObject")
              ? ["Inside your own scroll area? Pass its ref as `container` and give that element `position: relative` so scroll offsets measure correctly."]
              : []),
            "Respects reduced-motion where it matters and works with keyboard and touch.",
          ].map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>

      <nav className="mt-16 flex justify-between gap-6 border-t border-neutral-200 pt-3 dark:border-neutral-800">
        <Link href={`/components/${prev.slug}`} className="group">
          <span className="block font-normal text-neutral-400">← Previous</span>
          <span className="text-neutral-900 underline-offset-4 group-hover:underline dark:text-white">{prev.name}</span>
        </Link>
        <Link href={`/components/${next.slug}`} className="group text-right">
          <span className="block font-normal text-neutral-400">Next →</span>
          <span className="text-neutral-900 underline-offset-4 group-hover:underline dark:text-white">{next.name}</span>
        </Link>
      </nav>

      <a
        href={`${site.github}/tree/main/components/library/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block font-normal text-neutral-400 transition hover:text-neutral-900 dark:hover:text-white"
      >
        View source on GitHub ↗
      </a>

      <WorkWithMe />
    </main>
  );
}

/** One line to copy: a command or a line of code. */
function Command({ text, prompt }: { text: string; prompt?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200/80 bg-white py-1.5 pl-4 pr-1.5 font-mono text-[13px] font-normal normal-case tracking-normal text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
      <span className="truncate">
        {prompt && <span className="select-none text-neutral-400">$ </span>}
        {text}
      </span>
      <CopyButton text={text} />
    </div>
  );
}

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <li className="grid gap-3 sm:grid-cols-[170px_minmax(0,1fr)]">
      <div>
        <p className="font-normal text-neutral-400">0{n}</p>
        <p className="text-neutral-900 dark:text-white">{title}</p>
        {hint && <p className="mt-1 max-w-[150px] font-normal text-neutral-500">{hint}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </li>
  );
}
