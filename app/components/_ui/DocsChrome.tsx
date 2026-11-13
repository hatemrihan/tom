import Link from "next/link";
import { site } from "@/lib/site";
import { Mark } from "./Mark";

/** Closing block shared by the docs pages: the mark, one line, two links. */
export function WorkWithMe() {
  return (
    <footer className="mt-32 flex flex-col items-center text-center text-[11px] font-medium uppercase leading-[1.35] tracking-[0.01em]">
      <Mark className="size-10 text-neutral-900 dark:text-white" />
      <p className="mt-4 text-neutral-900 dark:text-white">
        Need something built?
        <br />
        <span className="font-normal text-neutral-500">Interfaces, motion and whole products</span>
      </p>
      <p className="mt-3 flex gap-5 text-neutral-900 dark:text-white">
        <Link href="/contact" className="underline-offset-4 hover:underline">
          Get in touch ↗
        </Link>
        <Link href="/work" className="underline-offset-4 hover:underline">
          See the work ↗
        </Link>
      </p>
      <p className="mt-16 font-normal text-neutral-400">
        ©{new Date().getFullYear()} · Components MIT licensed · Built by{" "}
        <Link href="/" className="underline-offset-4 hover:text-neutral-900 hover:underline dark:hover:text-white">
          {site.author}
        </Link>
      </p>
    </footer>
  );
}
