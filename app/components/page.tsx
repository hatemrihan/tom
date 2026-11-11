import { CATEGORIES } from "@/components/library/registry";
import { getResolvedRegistry } from "@/lib/component-settings";
import { site } from "@/lib/site";
import { Browser } from "./_ui/Browser";
import { groupByCategory } from "./_ui/group";
import { Hero } from "./_ui/Hero";
import { Objects } from "./_ui/Objects";
import { WorkWithMe } from "./_ui/DocsChrome";

export const revalidate = 60;

/** Components that read well as small, frameless objects. */
const SHELF = ["hold-to-confirm", "music-toggle", "horizontal-text-scroll", "result-slip", "expand-columns", "infinite-drag-grid"];

const STEPS = [
  ["01", "Install it", "npm i tomm-ui"],
  ["02", "Import a component", 'import { HoldToConfirm } from "tomm-ui"'],
  ["03", "Or own the code", "npx tomm-ui add hold-to-confirm"],
];

export default async function ComponentsPage() {
  const entries = await getResolvedRegistry();
  const shelf = SHELF.flatMap((slug) => entries.filter((e) => e.slug === slug)).map((e) => ({ slug: e.slug, name: e.name }));

  return (
    <>
      <Hero count={entries.length} handle={"@" + site.social.x.split("/").pop()} />
      <Objects entries={shelf} total={entries.length} />

      <main className="mx-auto w-full max-w-[1400px] px-4 pb-24 sm:px-6">
        <section id="all" className="mt-28 scroll-mt-24">
          <div className="mb-8">
            <h2 className="text-neutral-900 dark:text-white">All components</h2>
            <p className="font-normal text-neutral-500">Pick one, try it, take the code</p>
          </div>
          <Browser
            groups={groupByCategory(entries, CATEGORIES)}
            entries={entries.map((e) => ({ slug: e.slug, name: e.name, description: e.description }))}
          />
        </section>

        <section className="mt-28">
          <div className="mb-8">
            <h2 className="text-neutral-900 dark:text-white">Using them</h2>
            <p className="font-normal text-neutral-500">
              One package for React. For Flutter: <span className="font-mono normal-case">flutter pub add tomm</span>
            </p>
          </div>
          <ol className="grid gap-8 sm:grid-cols-3">
            {STEPS.map(([n, title, detail]) => (
              <li key={n} className="border-t border-neutral-200 pt-3 dark:border-neutral-800">
                <p className="font-normal text-neutral-400">{n}</p>
                <p className="mt-6 text-neutral-900 dark:text-white">{title}</p>
                <p className="mt-1 break-words font-mono text-[12px] font-normal normal-case tracking-normal text-neutral-500">{detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <WorkWithMe />
      </main>
    </>
  );
}
