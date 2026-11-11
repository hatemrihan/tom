"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { site } from "@/lib/site";
import { Mark } from "./Mark";
import { cn } from "@/lib/utils";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8-9.2L1 2h7l4.8 6.3L18.9 2zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20z" />
    </svg>
  );
}

const link =
  "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white";

const handle = "@" + site.social.x.split("/").pop();

/** Top navigation for the components docs. */
export function DocsNav({ count, theme = true, surface = "bg-[#fafafa]/85 dark:bg-stone-900/85" }: { count: number; /** Show the light/dark switch (the components docs have a dark theme; other pages do not). */ theme?: boolean; /** Backdrop behind the bar. */ surface?: string }) {
  const pathname = usePathname();
  const home = pathname === "/components";

  return (
    <header className={cn("sticky top-0 z-40 text-[11px] font-medium uppercase leading-[1.35] tracking-[0.01em] backdrop-blur-md", surface)}>
      <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" aria-label="TOM, home" className="flex items-center gap-2.5 text-neutral-900 dark:text-white">
          <Mark className="size-9" />
        </Link>

        <div className="flex items-center gap-2">
          <nav
            aria-label="Docs"
            className="flex h-9 items-center gap-0.5 rounded-full border border-neutral-200 bg-white/85 px-1 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/80"
          >
            <Link href="/components#all" className={cn(link, "hidden sm:inline-flex", home && "text-neutral-900 dark:text-white")}>
              Components
            </Link>
            <Link href="/#work" className={cn(link, "hidden md:inline-flex")}>
              Work
            </Link>
            <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={link}>
              <Github className="size-3.5" />
              <span className="hidden lg:inline">GitHub</span>
            </a>
            <a href={site.social.x} target="_blank" rel="noopener noreferrer" aria-label="X" className={link}>
              <XIcon className="size-3" />
              <span className="hidden lg:inline">{handle}</span>
            </a>
            <Link href="/components#all" className={cn(link, "tabular-nums")} aria-label={`${count} components`}>
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              {count}
            </Link>
{theme && (
            <ThemeToggle
              target={() => document.getElementById("docs-root") ?? document.documentElement}
              storageKey="tom-docs-theme"
              className="size-7 rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
            />
            )}
          </nav>

          <Link
            href="/components#all"
            className="inline-flex h-9 items-center rounded-full bg-neutral-900 px-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:bg-neutral-700 active:scale-[0.97] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Build
          </Link>
        </div>
      </div>
    </header>
  );
}
