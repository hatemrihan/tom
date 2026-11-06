"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { previews } from "@/components/library/previews";
import { cn } from "@/lib/utils";

class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <p className="text-sm text-neutral-400">Preview unavailable.</p> : this.props.children;
  }
}

export function PreviewFrame({
  slug,
  height = 320,
  replay = true,
  compact = false,
  className,
}: {
  slug: string;
  height?: number;
  replay?: boolean;
  /** Smaller, non-interactive-chrome version used in grid cards. */
  compact?: boolean;
  className?: string;
}) {
  const Demo = previews[slug];
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [run, setRun] = useState(0);
  const [scale, setScale] = useState(compact ? 0.75 : 1);

  // Scale the demo down so it always fits the frame (cards + small screens).
  useEffect(() => {
    const frame = ref.current;
    const content = inner.current;
    if (!frame || !content || !visible) return;
    const max = compact ? 0.8 : 1;
    const fit = () => {
      const h = content.offsetHeight;
      const w = content.scrollWidth;
      if (!h || !w) return;
      const s = Math.min(max, (frame.clientHeight - (compact ? 24 : 40)) / h, frame.clientWidth / w);
      setScale(Math.max(0.3, Number(s.toFixed(3))));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(frame);
    ro.observe(content);
    return () => ro.disconnect();
  }, [visible, compact, run]);

  // Mount demos only when near the viewport (keeps the grid fast).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        compact ? "rounded-xl bg-neutral-100/70 dark:bg-neutral-900/70" : "rounded-2xl",
        className
      )}
      style={{ height }}
    >
      {replay && (
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="absolute right-3 top-3 z-20 inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white/90 px-2.5 text-xs text-neutral-600 shadow-sm backdrop-blur transition hover:text-neutral-900 active:scale-[0.97] dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-400 dark:hover:text-white"
        >
          <RotateCcw className="size-3.5" /> Replay
        </button>
      )}
      <div
        ref={inner}
        className="flex w-full shrink-0 items-center justify-center px-6"
        style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
      >
        {visible && Demo ? (
          <PreviewBoundary key={run}>
            <Demo />
          </PreviewBoundary>
        ) : (
          <div className="size-8 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
        )}
      </div>
    </div>
  );
}
