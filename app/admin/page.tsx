"use client";

import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import { projectTypeLabel } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { BarChart, DonutChart, HorizontalBars, Sparkline } from "./_components/charts";
import { Avatar, Card, PageHeader, STATUS_STYLES, StatusChip } from "./_components/AdminShell";
import { useContacts } from "./_components/use-contacts";
import { DatabaseNotice } from "./_components/DatabaseNotice";

export default function AdminOverviewPage() {
  const { contacts, stats, loading, error, reload } = useContacts();

  const timeline = stats?.timeline ?? [];
  const last7 = timeline.slice(-7).reduce((s, d) => s + d.count, 0);
  const prev7 = timeline.slice(-14, -7).reduce((s, d) => s + d.count, 0);
  const delta = prev7 === 0 ? (last7 > 0 ? 100 : 0) : Math.round(((last7 - prev7) / prev7) * 100);
  const responded = stats?.status.responded ?? 0;
  const responseRate = stats && stats.total > 0 ? Math.round((responded / stats.total) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Overview"
        description="How the portfolio is converting visitors into conversations."
        actions={
          <button
            onClick={reload}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs text-neutral-600 transition hover:bg-neutral-50"
          >
            <RefreshCw className={cn("size-3.5", loading && "animate-spin")} /> Refresh
          </button>
        }
      />

      {error && <DatabaseNotice message={error} />}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total messages" value={stats?.total} loading={loading && !stats} />
        <Stat
          label="Unread"
          value={stats?.status.unread}
          loading={loading && !stats}
          accent={stats && stats.status.unread > 0 ? "text-blue-600" : undefined}
        />
        <Stat
          label="Last 7 days"
          value={last7}
          loading={loading && !stats}
          hint={
            stats ? (
              <span className={cn(delta > 0 ? "text-emerald-600" : delta < 0 ? "text-red-500" : "text-neutral-400")}>
                {delta > 0 ? "+" : ""}
                {delta}% vs prior week
              </span>
            ) : null
          }
          spark={timeline.slice(-14).map((d) => d.count)}
        />
        <Stat label="Response rate" value={stats ? `${responseRate}%` : undefined} loading={loading && !stats} />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-5">
        <Card title="Submissions" className="lg:col-span-3">
          {stats ? <BarChart data={timeline} /> : <Skeleton className="h-[200px]" />}
        </Card>
        <Card title="Status" className="lg:col-span-2">
          {stats ? (
            <DonutChart
              label="Messages"
              segments={Object.entries(STATUS_STYLES).map(([key, s]) => ({
                label: s.label,
                value: stats.status[key as keyof typeof stats.status] ?? 0,
                color: s.color,
              }))}
            />
          ) : (
            <Skeleton className="h-[148px]" />
          )}
        </Card>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-5">
        <Card title="Project types" className="lg:col-span-2">
          {stats ? (
            <HorizontalBars
              rows={stats.projectTypes.map((p) => ({ label: projectTypeLabel(p.type === "unknown" ? null : p.type), value: p.count }))}
            />
          ) : (
            <Skeleton className="h-32" />
          )}
        </Card>
        <Card
          title="Latest messages"
          className="lg:col-span-3"
          action={
            <Link href="/admin/contacts" className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900">
              Open inbox <ArrowRight className="size-3" />
            </Link>
          }
        >
          {loading && contacts.length === 0 ? (
            <Skeleton className="h-40" />
          ) : contacts.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500">No messages yet.</p>
          ) : (
            <ul className="-mx-2 divide-y divide-neutral-100">
              {contacts.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/admin/contacts?id=${c.id}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-neutral-50"
                  >
                    <Avatar name={c.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <p className="truncate text-xs text-neutral-500">
                        {projectTypeLabel(c.projectType)} · {c.email}
                      </p>
                    </div>
                    <StatusChip status={c.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  loading,
  hint,
  accent,
  spark,
}: {
  label: string;
  value?: number | string;
  loading?: boolean;
  hint?: React.ReactNode;
  accent?: string;
  spark?: number[];
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <p className="text-xs text-neutral-500">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className={cn("text-2xl font-semibold tabular-nums tracking-tight", accent)}>{value ?? "—"}</p>
        )}
        {spark && spark.length > 1 && <Sparkline values={spark} className="text-neutral-400" />}
      </div>
      {hint && <p className="mt-1 text-[11px]">{hint}</p>}
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-neutral-100", className)} />;
}
