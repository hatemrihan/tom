"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Maximize2, Minimize2, RotateCcw } from "lucide-react";
import { previews } from "@/components/library/previews";
import { cn } from "@/lib/utils";

class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <p className="text-neutral-400">Preview unavailable.</p> : this.props.children;
  }
}

export function PreviewFrame({
  slug,
  height = 320,
  replay = true,
  compact = false,
  bare = false,
  align = "center",
  className,
}: {
  slug: string;
  height?: number | string;
  replay?: boolean;
  /** Smaller, non-interactive-chrome version used in grid cards. */
  compact?: boolean;
  /** No backdrop at all: the demo sits directly on the page. */
  bare?: boolean;
  /** "top" leaves room below for menus and popovers that open downward. */
  align?: "center" | "top";
  className?: string;
}) {
  const Demo = previews[slug];
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [run, setRun] = useState(0);
  const [full, setFull] = useState(false);
  const [fit, setFit] = useState<{ scale: number; width?: number }>({ scale: compact ? 0.75 : 1 });

  // Scale the demo down so it always fits the frame. When it has to shrink, the
  // demo is laid out on a proportionally wider canvas so it still fills the frame.
  useEffect(() => {
    const frame = ref.current;
    const content = inner.current;
    if (!frame || !content || !visible) return;
    const pad = bare ? 0 : compact ? 28 : 40;
    const measure = () => {
      const h = content.offsetHeight;
      if (!h) return;
      const frameW = frame.clientWidth;
      let s = Math.max(0.3, Math.min(1, Number(((frame.clientHeight - pad) / h).toFixed(2))));
      let width = s < 1 ? Math.round(frameW / s) : undefined;
      // Content wider than its canvas (fixed-width demos): shrink to fit sideways too.
      const need = Math.max(...Array.from(content.children, (c) => (c as HTMLElement).offsetWidth)) + 48;
      if (need > (width ?? frameW) + 2) {
        width = need;
        s = Math.max(0.3, Number((frameW / need).toFixed(2)));
      }
      setFit((prev) => (Math.abs(prev.scale - s) < 0.06 && Math.abs((prev.width ?? 0) - (width ?? 0)) < 16 ? prev : { scale: s, width }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    ro.observe(content);
    return () => ro.disconnect();
  }, [visible, compact, bare, run, full]);

  // Full screen: the frame itself goes full screen, so the demo keeps its state.
  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === ref.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void ref.current?.requestFullscreen?.().catch(() => {});
  };

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
        "relative flex justify-center overflow-hidden",
        align === "top" && !compact ? "items-start pt-14" : "items-center",
        compact ? "rounded-xl bg-neutral-100/70 dark:bg-neutral-900/70" : "rounded-2xl bg-neutral-100/70 dark:bg-white/[0.04]",
        bare && "overflow-visible rounded-none !bg-none bg-transparent dark:bg-transparent",
        full && "rounded-none bg-[#fafafa] text-[11px] font-medium uppercase tracking-[0.01em] dark:bg-stone-900",
        className
      )}
      style={{ height: full ? "100%" : height }}
    >
      {replay && (
        <div className="absolute right-4 top-3 z-20 flex items-center gap-4 uppercase text-neutral-400">
          <button type="button" onClick={() => setRun((r) => r + 1)} className="inline-flex items-center gap-1.5 transition hover:text-neutral-900 dark:hover:text-white">
            <RotateCcw className="size-3" /> Replay
          </button>
          <button type="button" onClick={toggleFull} className="inline-flex items-center gap-1.5 transition hover:text-neutral-900 dark:hover:text-white">
            {full ? <Minimize2 className="size-3" /> : <Maximize2 className="size-3" />} {full ? "Exit" : "Full screen"}
          </button>
        </div>
      )}
      <div
        ref={inner}
        className="flex w-full shrink-0 items-center justify-center px-6 text-base font-normal normal-case leading-normal tracking-normal"
        style={{ transform: `scale(${fit.scale})`, transformOrigin: align === "top" && !compact ? "top center" : "center", width: fit.width }}
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
