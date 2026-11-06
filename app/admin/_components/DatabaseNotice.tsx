import { TriangleAlert } from "lucide-react";

export function DatabaseNotice({ message }: { message: string }) {
  return (
    <div className="mb-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <TriangleAlert className="mt-0.5 size-4 shrink-0" />
      <div>
        <p className="font-medium">Couldn&apos;t load data</p>
        <p className="mt-0.5 text-amber-800/80">{message}</p>
        <p className="mt-2 text-xs text-amber-800/70">
          Check that <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-amber-100 px-1">SUPABASE_SECRET_KEY</code> are set, and that{" "}
          <code className="rounded bg-amber-100 px-1">supabase/migrations</code> has been run.
        </p>
      </div>
    </div>
  );
}
