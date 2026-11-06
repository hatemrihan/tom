import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Frame } from "./ComponentGrid";
import { PreviewFrame } from "./PreviewFrame";

export function DocsHeader() {
  return (
    <header className="flex items-center justify-between py-10 md:py-14">
      <Link href="/components" className="flex items-center gap-2.5">
        <span className="size-3.5 bg-neutral-900 dark:bg-white" />
        <span className="text-[17px] font-medium tracking-tight">TOM</span>
        <span className="text-[17px] text-neutral-400">/ Components</span>
      </Link>
      <Link href="/" className="text-sm text-neutral-500 transition hover:text-neutral-900 dark:hover:text-white">
        Portfolio ↗
      </Link>
    </header>
  );
}

export function WorkWithMe() {
  return (
    <section className="mt-20">
      <Frame>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-950 md:p-10">
            <p className="text-[15px] font-medium">Want to work with me?</p>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-neutral-500">
              I design and build interfaces like these for startups and brands — from a single interaction to the whole
              product.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/contact"
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-neutral-900 px-3.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
              >
                Jump on a call <Phone className="size-4" />
              </Link>
              <Link
                href="/#work"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 text-sm text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
              >
                See my work <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            <PreviewFrame slug="logo-trace-loader" height={240} />
          </div>
        </div>
      </Frame>
    </section>
  );
}
