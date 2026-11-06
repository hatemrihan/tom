"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Eye, EyeOff, Loader2, RotateCcw, Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "../_components/AdminShell";
import { DatabaseNotice } from "../_components/DatabaseNotice";

interface Row {
  slug: string;
  name: string;
  description: string;
  category: string;
  hidden: boolean;
  featured: boolean;
  order: number;
  customized: boolean;
}

export default function AdminComponentsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [dbReady, setDbReady] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/components", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setRows(data.components);
      setDbReady(data.databaseConfigured);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
     
    load();
  }, [load]);

  const save = async (slug: string, patch: Partial<Row>) => {
    setSaving(slug);
    setRows((r) => r.map((x) => (x.slug === slug ? { ...x, ...patch, customized: true } : x)));
    try {
      const res = await fetch("/api/admin/components", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, ...patch }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Save failed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      load();
    } finally {
      setSaving(null);
    }
  };

  const reset = async (slug: string) => {
    setSaving(slug);
    await fetch("/api/admin/components", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
    await load();
    setSaving(null);
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter((r) => !q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
  }, [rows, query]);

  const visibleCount = rows.filter((r) => !r.hidden).length;
  const featuredCount = rows.filter((r) => r.featured).length;

  return (
    <>
      <PageHeader
        title="Components"
        description={`${visibleCount} of ${rows.length} published · ${featuredCount} featured on the library home.`}
        actions={
          <a href="/components" target="_blank" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs text-neutral-600 transition hover:bg-neutral-50">
            Open library <ArrowUpRight className="size-3.5" />
          </a>
        }
      />

      {!dbReady && <DatabaseNotice message="Edits are stored in Supabase. Connect a database to customise components — until then, the defaults from registry.ts are used." />}
      {error && dbReady && <DatabaseNotice message={error} />}

      <label className="relative mb-4 block max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter components"
          className="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-8 pr-3 text-sm outline-none focus:border-neutral-300 focus:bg-white"
        />
      </label>

      <div className="overflow-hidden rounded-xl border border-neutral-200">
        {loading ? (
          <div className="flex h-40 items-center justify-center text-neutral-400">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {filtered.map((r) => (
              <li key={r.slug} className={cn("px-4 py-3 transition-colors", r.hidden && "bg-neutral-50/70")}>
                {editing === r.slug ? (
                  <EditForm
                    row={r}
                    onCancel={() => setEditing(null)}
                    onSave={(patch) => {
                      setEditing(null);
                      save(r.slug, patch);
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={cn("truncate text-sm font-medium", r.hidden && "text-neutral-400 line-through")}>{r.name}</p>
                        <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-500">{r.category}</span>
                        {r.customized && <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-600">edited</span>}
                      </div>
                      <p className="truncate text-xs text-neutral-500">{r.description}</p>
                    </div>
                    {saving === r.slug && <Loader2 className="size-3.5 animate-spin text-neutral-400" />}
                    <IconButton label={r.featured ? "Unfeature" : "Feature"} active={r.featured} disabled={!dbReady} onClick={() => save(r.slug, { featured: !r.featured })}>
                      <Star className={cn("size-4", r.featured && "fill-amber-400 text-amber-500")} />
                    </IconButton>
                    <IconButton label={r.hidden ? "Show" : "Hide"} disabled={!dbReady} onClick={() => save(r.slug, { hidden: !r.hidden })}>
                      {r.hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </IconButton>
                    <button
                      type="button"
                      disabled={!dbReady}
                      onClick={() => setEditing(r.slug)}
                      className="h-8 rounded-lg px-2.5 text-xs text-neutral-600 transition hover:bg-neutral-100 disabled:opacity-40"
                    >
                      Edit
                    </button>
                    {r.customized && (
                      <IconButton label="Reset to default" onClick={() => reset(r.slug)}>
                        <RotateCcw className="size-3.5" />
                      </IconButton>
                    )}
                    <a href={`/components/${r.slug}`} target="_blank" aria-label="Open docs page" className="flex size-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900">
                      <ArrowUpRight className="size-4" />
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-3 text-xs text-neutral-400">Changes go live on the public library within a minute.</p>
    </>
  );
}

function EditForm({ row, onSave, onCancel }: { row: Row; onSave: (p: Partial<Row>) => void; onCancel: () => void }) {
  const [name, setName] = useState(row.name);
  const [description, setDescription] = useState(row.description);
  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ name, description });
      }}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={60}
        autoFocus
        aria-label="Name"
        className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm font-medium outline-none focus:border-neutral-400"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={240}
        rows={2}
        aria-label="Description"
        className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="h-8 rounded-lg px-3 text-xs text-neutral-500 hover:bg-neutral-100">
          Cancel
        </button>
        <button type="submit" className="h-8 rounded-lg bg-neutral-900 px-3 text-xs font-medium text-white hover:bg-neutral-800">
          Save
        </button>
      </div>
    </form>
  );
}

function IconButton({ label, onClick, children, active, disabled }: { label: string; onClick: () => void; children: React.ReactNode; active?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-40"
    >
      {children}
    </button>
  );
}
