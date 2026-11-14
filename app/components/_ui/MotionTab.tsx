"use client";

import dynamic from "next/dynamic";

/** The editor is only downloaded when someone opens the Motion tab. */
const Studio = dynamic(() => import("./Studio"), {
  ssr: false,
  loading: () => <div className="h-[560px] animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-900" />,
});

export function MotionTab({ slug }: { slug: string }) {
  return <Studio slug={slug} />;
}
