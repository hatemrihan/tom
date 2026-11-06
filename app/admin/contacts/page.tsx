"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  Building2,
  Check,
  Download,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_STATUSES, projectTypeLabel, type ContactRecord, type ContactStatus } from "@/lib/contact";
import { Avatar, PageHeader, STATUS_STYLES, StatusChip } from "../_components/AdminShell";
import { useContacts } from "../_components/use-contacts";
import { DatabaseNotice } from "../_components/DatabaseNotice";

type Filter = ContactStatus | "all";

export default function ContactsPage() {
  return (
    <Suspense>
      <Inbox />
    </Suspense>
  );
}

function Inbox() {
  const router = useRouter();
  const params = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const { contacts, stats, loading, error, updateStatus, remove } = useContacts({ status: filter, q: query });

  const activeId = params.get("id");
  const active = useMemo(() => contacts.find((c) => c.id === activeId) ?? null, [contacts, activeId]);

  const open = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id) next.set("id", id);
    else next.delete("id");
    router.replace(`/admin/contacts${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  // Opening an unread message marks it as read.
  useEffect(() => {
    if (active && active.status === "unread") {
      updateStatus([active.id], "read").catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

  // j / k to move through the list, Escape to close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      const idx = contacts.findIndex((c) => c.id === activeId);
      if (e.key === "j" || e.key === "ArrowDown") {
        const next = contacts[Math.min(idx + 1, contacts.length - 1)];
        if (next) open(next.id);
      } else if (e.key === "k" || e.key === "ArrowUp") {
        const prev = contacts[Math.max(idx - 1, 0)];
        if (prev) open(prev.id);
      } else if (e.key === "Escape") {
        open(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const run = async (fn: () => Promise<void>, message: string) => {
    try {
      await fn();
      setToast(message);
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allSelected = contacts.length > 0 && contacts.every((c) => selected.has(c.id));
  const ids = [...selected];

  const tabs: { key: Filter; label: string; count?: number }[] = [
    { key: "all", label: "All", count: stats?.total },
    ...CONTACT_STATUSES.map((s) => ({ key: s as Filter, label: STATUS_STYLES[s].label, count: stats?.status[s] })),
  ];

  return (
    <>
      <PageHeader
        title="Inbox"
        description="Every message sent through the contact stepper."
        actions={
          <button
            onClick={() => exportCsv(contacts)}
            disabled={contacts.length === 0}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-40"
          >
            <Download className="size-3.5" /> Export CSV
          </button>
        }
      />

      {error && <DatabaseNotice message={error} />}

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setFilter(t.key);
                setSelected(new Set());
              }}
              className={cn(
                "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs transition",
                filter === t.key ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={cn("tabular-nums", filter === t.key ? "text-white/60" : "text-neutral-400")}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
        <label className="relative block md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, message…"
            className="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-8 pr-8 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white"
          />
          {query && (
            <button
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="size-3.5" />
            </button>
          )}
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* List */}
        <div className={cn("min-w-0", active && "hidden lg:block")}>
          <div className="flex h-10 items-center gap-3 rounded-t-xl border border-b-0 border-neutral-200 bg-neutral-50/60 px-3 text-xs text-neutral-500">
            <Checkbox
              checked={allSelected}
              onChange={() => setSelected(allSelected ? new Set() : new Set(contacts.map((c) => c.id)))}
              label="Select all"
            />
            {selected.size > 0 ? (
              <div className="flex flex-1 items-center gap-1">
                <span className="mr-auto">{selected.size} selected</span>
                <BulkButton onClick={() => run(() => updateStatus(ids, "read"), "Marked as read")}>
                  <Check className="size-3.5" /> Read
                </BulkButton>
                <BulkButton onClick={() => run(() => updateStatus(ids, "archived"), "Archived")}>
                  <Archive className="size-3.5" /> Archive
                </BulkButton>
                <ConfirmButton
                  onConfirm={() =>
                    run(async () => {
                      await remove(ids);
                      setSelected(new Set());
                    }, "Deleted")
                  }
                />
              </div>
            ) : (
              <span>{loading ? "Loading…" : `${contacts.length} messages`}</span>
            )}
          </div>
          <ul className="max-h-[calc(100dvh-300px)] min-h-64 divide-y divide-neutral-100 overflow-y-auto rounded-b-xl border border-neutral-200">
            {loading && contacts.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="flex gap-3 p-3">
                    <div className="size-8 animate-pulse rounded-full bg-neutral-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-100" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-100" />
                    </div>
                  </li>
                ))
              : contacts.length === 0 && (
                  <li className="flex h-64 flex-col items-center justify-center gap-1 text-center">
                    <p className="text-sm text-neutral-900">Nothing here</p>
                    <p className="text-xs text-neutral-500">{query ? "Try a different search." : "New messages will show up here."}</p>
                  </li>
                )}
            {contacts.map((c) => (
              <li
                key={c.id}
                className={cn(
                  "group flex cursor-pointer items-start gap-3 px-3 py-3 transition-colors",
                  c.id === activeId ? "bg-neutral-100" : "hover:bg-neutral-50"
                )}
                onClick={() => open(c.id)}
              >
                <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={selected.has(c.id)} onChange={() => toggle(c.id)} label={`Select ${c.name}`} />
                </div>
                <Avatar name={c.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {c.status === "unread" && <span className="size-1.5 shrink-0 rounded-full bg-blue-500" />}
                    <p className={cn("truncate text-sm", c.status === "unread" ? "font-semibold" : "font-medium")}>{c.name}</p>
                    <span className="ml-auto shrink-0 text-[11px] tabular-nums text-neutral-400">{relativeTime(c.submittedAt)}</span>
                  </div>
                  <p className="truncate text-xs text-neutral-500">{c.email}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-neutral-400">
                    {projectTypeLabel(c.projectType)}
                    {c.message ? ` — ${c.message}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 hidden text-[11px] text-neutral-400 lg:block">
            Tip: use <Kbd>j</Kbd> / <Kbd>k</Kbd> to move, <Kbd>esc</Kbd> to close.
          </p>
        </div>

        {/* Detail */}
        <div className={cn("min-w-0", !active && "hidden lg:block")}>
          {active ? (
            <Detail
              contact={active}
              onBack={() => open(null)}
              onStatus={(s) => run(() => updateStatus([active.id], s), `Marked as ${STATUS_STYLES[s].label.toLowerCase()}`)}
              onDelete={() =>
                run(async () => {
                  await remove([active.id]);
                  open(null);
                }, "Deleted")
              }
            />
          ) : (
            <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 text-center">
              <Mail className="mb-3 size-5 text-neutral-300" />
              <p className="text-sm text-neutral-500">Select a message to read it</p>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 rounded-full bg-neutral-900 px-4 py-2 text-sm text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </>
  );
}

function Detail({
  contact,
  onBack,
  onStatus,
  onDelete,
}: {
  contact: ContactRecord;
  onBack: () => void;
  onStatus: (s: ContactStatus) => void;
  onDelete: () => void;
}) {
  const subject = encodeURIComponent(`Re: your ${projectTypeLabel(contact.projectType).toLowerCase()} project`);
  const greeting = encodeURIComponent(`Hi ${contact.name.split(" ")[0]},\n\nThanks for reaching out!\n\n`);
  const phoneDigits = contact.phone?.replace(/[^\d+]/g, "").replace(/^\+/, "");

  return (
    <article className="rounded-xl border border-neutral-200">
      <header className="flex items-start gap-4 border-b border-neutral-100 p-5">
        <button
          onClick={onBack}
          aria-label="Back to list"
          className="-ml-1 mt-2 flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 lg:hidden"
        >
          <ArrowLeft className="size-4" />
        </button>
        <Avatar name={contact.name} size="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-medium">{contact.name}</h2>
          <p className="truncate text-sm text-neutral-500">{contact.email}</p>
          <div className="mt-2">
            <StatusChip status={contact.status} />
          </div>
        </div>
        <p className="hidden shrink-0 text-right text-xs text-neutral-400 sm:block">
          {new Date(contact.submittedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </header>

      <dl className="grid grid-cols-2 gap-px bg-neutral-100 text-sm sm:grid-cols-3">
        <Field label="Project" value={projectTypeLabel(contact.projectType)} />
        <Field label="Company" value={contact.companyName} icon={<Building2 className="size-3.5" />} />
        <Field label="Phone" value={contact.phone} icon={<Phone className="size-3.5" />} />
      </dl>

      <div className="p-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">Message</p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
          {contact.message || <span className="text-neutral-400">No message was included.</span>}
        </p>
      </div>

      <footer className="flex flex-wrap items-center gap-2 border-t border-neutral-100 p-4">
        <a
          href={`mailto:${contact.email}?subject=${subject}&body=${greeting}`}
          onClick={() => contact.status !== "responded" && onStatus("responded")}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-neutral-900 px-3.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Mail className="size-4" /> Reply by email
        </a>
        {phoneDigits && (
          <a
            href={`https://wa.me/${phoneDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 px-3.5 text-sm text-neutral-700 transition hover:bg-neutral-50"
          >
            <MessageCircle className="size-4" /> WhatsApp
          </a>
        )}
        <div className="ml-auto flex items-center gap-2">
          <label className="sr-only" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            value={contact.status}
            onChange={(e) => onStatus(e.target.value as ContactStatus)}
            className="h-9 rounded-lg border border-neutral-200 bg-white px-2.5 text-sm outline-none focus:border-neutral-400"
          >
            {CONTACT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_STYLES[s].label}
              </option>
            ))}
          </select>
          <ConfirmButton onConfirm={onDelete} large />
        </div>
      </footer>
    </article>
  );
}

function Field({ label, value, icon }: { label: string; value?: string | null; icon?: React.ReactNode }) {
  return (
    <div className="bg-white px-5 py-3">
      <dt className="text-[11px] uppercase tracking-wide text-neutral-400">{label}</dt>
      <dd className="mt-0.5 flex items-center gap-1.5 truncate text-neutral-800">
        {value ? (
          <>
            {icon && <span className="text-neutral-400">{icon}</span>}
            <span className="truncate">{value}</span>
          </>
        ) : (
          <span className="text-neutral-300">—</span>
        )}
      </dd>
    </div>
  );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "flex size-4 items-center justify-center rounded border transition",
        checked ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 bg-white hover:border-neutral-400"
      )}
    >
      {checked && <Check className="size-3" strokeWidth={3} />}
    </button>
  );
}

function BulkButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-neutral-600 transition hover:bg-neutral-200/60 hover:text-neutral-900"
    >
      {children}
    </button>
  );
}

/** Two-step delete: first click arms it, second click within 3s confirms. */
function ConfirmButton({ onConfirm, large }: { onConfirm: () => void; large?: boolean }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else setArmed(true);
      }}
      className={cn(
        "inline-flex items-center gap-1 rounded-md transition",
        large ? "h-9 rounded-lg px-3 text-sm" : "h-7 px-2 text-xs",
        armed ? "bg-red-600 text-white hover:bg-red-700" : "text-neutral-500 hover:bg-red-50 hover:text-red-600"
      )}
    >
      <Trash2 className={large ? "size-4" : "size-3.5"} />
      {armed ? "Confirm" : large ? "" : "Delete"}
    </button>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1 font-mono text-[10px]">{children}</kbd>;
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function exportCsv(rows: ContactRecord[]) {
  const cols: (keyof ContactRecord)[] = ["submittedAt", "name", "email", "phone", "companyName", "projectType", "status", "message"];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => escape(r[c])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
