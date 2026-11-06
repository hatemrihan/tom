"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  Blocks,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/contacts", label: "Inbox", icon: Inbox },
  { href: "/admin/components", label: "Components", icon: Blocks },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-3 pb-6 pt-1 text-neutral-900">
        <span className="size-3 bg-neutral-900" />
        <span className="text-sm font-medium tracking-tight">TOM Admin</span>
      </div>
      <nav className="space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex h-9 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors",
                active
                  ? "bg-white text-neutral-900 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
                  : "text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-900"
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-0.5 pt-6">
        <Link
          href="/"
          target="_blank"
          className="flex h-9 items-center gap-2.5 rounded-lg px-3 text-sm text-neutral-500 transition-colors hover:bg-neutral-200/50 hover:text-neutral-900"
        >
          <ArrowUpRight className="size-4" /> View site
        </Link>
        <button
          onClick={logout}
          className="flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-sm text-neutral-500 transition-colors hover:bg-neutral-200/50 hover:text-neutral-900"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-neutral-100/70 font-sans text-neutral-900">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-56 p-4 lg:block">{sidebar}</aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-200 bg-neutral-100/90 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="size-3 bg-neutral-900" /> TOM Admin
        </div>
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex size-9 items-center justify-center rounded-lg hover:bg-neutral-200"
        >
          <Menu className="size-5" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-neutral-100 p-4 shadow-xl">
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg hover:bg-neutral-200"
            >
              <X className="size-4" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="lg:pl-56">
        <div className="min-h-dvh p-3 lg:py-4 lg:pr-4 lg:pl-0">
          <div className="min-h-[calc(100dvh-2rem)] rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-medium tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  title,
  action,
  className,
  children,
}: {
  title?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-xl border border-neutral-200 p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-sm font-medium text-neutral-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export const STATUS_STYLES: Record<string, { label: string; dot: string; chip: string; color: string }> = {
  unread: { label: "Unread", dot: "bg-blue-500", chip: "bg-blue-50 text-blue-700 ring-blue-600/15", color: "#3b82f6" },
  read: { label: "Read", dot: "bg-amber-500", chip: "bg-amber-50 text-amber-700 ring-amber-600/15", color: "#f59e0b" },
  responded: { label: "Responded", dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 ring-emerald-600/15", color: "#10b981" },
  archived: { label: "Archived", dot: "bg-neutral-400", chip: "bg-neutral-100 text-neutral-600 ring-neutral-500/15", color: "#a3a3a3" },
};

export function Avatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  const hue = Math.abs(hash) % 360;
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-medium",
        size === "lg" ? "size-11 text-sm" : "size-8 text-[11px]"
      )}
      style={{ background: `oklch(0.94 0.03 ${hue})`, color: `oklch(0.4 0.08 ${hue})` }}
    >
      {initials || "?"}
    </span>
  );
}

export function StatusChip({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.unread;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset", s.chip)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
