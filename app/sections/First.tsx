import { registry } from "@/components/library/registry";
import { site } from "@/lib/site";
import { work } from "@/lib/work";
import { Mark } from "../components/_ui/Mark";

/**
 * The opening of the site, the same quiet block as the components page: the
 * mark in the centre and a few small lines of text either side.
 */
export default function First() {

  return (
    <section aria-label="Intro" className="flex h-[min(100svh,760px)] min-h-[520px] w-full flex-col items-center justify-center bg-white px-6 text-neutral-900">
      <Mark className="size-16" />

      <div className="mt-5 grid grid-cols-1 gap-x-9 gap-y-4 text-center text-[11px] font-medium uppercase leading-[1.25] tracking-[0.01em] sm:grid-cols-2 sm:text-left">
        <div className="sm:text-right">
          <h1>
            {site.author}
            <br />
            Software engineer
          </h1>
          <p className="mt-2.5 font-normal text-neutral-500">
            {site.name}
            <br />
            ©{new Date().getFullYear()}
          </p>
        </div>
        <div>
          <p>
            Products, interfaces
            <br />
            and open-source components
          </p>
          <p className="mt-2.5">
            {work.length} projects
            <br />
            {registry.length} components
            <br />

          </p>
        </div>
      </div>
    </section>
  );
}
