"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Blocks, Github, House, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/library/theme-toggle/theme-toggle";
import { AnimatedTooltip } from "@/components/library/animated-tooltip/animated-tooltip";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8-9.2L1 2h7l4.8 6.3L18.9 2zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20z" />
    </svg>
  );
}

const ITEMS = [
  { href: "/", label: "Home", icon: House, external: false },
  { href: "/components", label: "Components", icon: Blocks, external: false },
  { href: site.social.x, label: "X", icon: XIcon, external: true },
  { href: site.github, label: "GitHub", icon: Github, external: true },
  { href: "/contact", label: "Contact", icon: Mail, external: false },
];

/** Floating bottom dock for the components docs. */
export function Dock() {
  const pathname = usePathname();

  return (
    <motion.nav
      aria-label="Docs"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.3 }}
      className="fixed inset-x-0 bottom-5 z-40 mx-auto flex w-fit items-center gap-1 rounded-2xl bg-neutral-950 p-1.5 text-neutral-400 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] dark:bg-neutral-900 dark:ring-1 dark:ring-white/10"
    >
      {ITEMS.map(({ href, label, icon: Icon, external }) => {
        const active = !external && (href === "/components" ? pathname === href : false);
        const inner = (
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-xl transition-colors hover:bg-white/10 hover:text-white",
              active && "bg-white/10 text-white"
            )}
          >
            <Icon className="size-[18px]" />
          </span>
        );
        return (
          <AnimatedTooltip key={label} content={label}>
            {external ? (
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                {inner}
              </a>
            ) : (
              <Link href={href} aria-label={label}>
                {inner}
              </Link>
            )}
          </AnimatedTooltip>
        );
      })}
      <span className="mx-1 h-6 w-px bg-white/10" />
      <AnimatedTooltip content="Theme">
        <ThemeToggle
          target={() => document.getElementById("docs-root") ?? document.documentElement}
          storageKey="tom-docs-theme"
          className="size-10 rounded-xl text-neutral-400 hover:bg-white/10 hover:text-white dark:text-neutral-400 dark:hover:bg-white/10"
        />
      </AnimatedTooltip>
    </motion.nav>
  );
}
