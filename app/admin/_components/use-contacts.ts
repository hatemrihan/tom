"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ContactRecord, ContactStatus } from "@/lib/contact";

export interface ContactStats {
  total: number;
  status: Record<ContactStatus, number>;
  projectTypes: { type: string; count: number }[];
  timeline: { date: string; count: number }[];
}

interface Query {
  status?: ContactStatus | "all";
  q?: string;
}

export function useContacts(query: Query = {}) {
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const { status, q } = query;

  const load = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (status && status !== "all") params.set("status", status);
      if (q) params.set("q", q);
      const res = await fetch(`/api/admin/contacts?${params}`, { cache: "no-store" });
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load contacts");
      if (id !== requestId.current) return; // a newer request superseded this one
      setContacts(data.contacts);
      setStats(data.stats);
    } catch (err) {
      if (id === requestId.current) {
        setError(err instanceof Error ? err.message : "Failed to load contacts");
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [status, q]);

  useEffect(() => {
    const t = setTimeout(load, q ? 250 : 0); // debounce search typing
    return () => clearTimeout(t);
  }, [load, q]);

  const updateStatus = useCallback(
    async (ids: string[], next: ContactStatus) => {
      // Optimistic update — feels instant, rolls back on failure.
      const previous = contacts;
      setContacts((list) => list.map((c) => (ids.includes(c.id) ? { ...c, status: next } : c)));
      const res = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, status: next }),
      });
      if (!res.ok) {
        setContacts(previous);
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Update failed");
      }
      load();
    },
    [contacts, load]
  );

  const remove = useCallback(
    async (ids: string[]) => {
      const previous = contacts;
      setContacts((list) => list.filter((c) => !ids.includes(c.id)));
      const res = await fetch("/api/admin/contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) {
        setContacts(previous);
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Delete failed");
      }
      load();
    },
    [contacts, load]
  );

  return { contacts, stats, loading, error, reload: load, updateStatus, remove };
}
