"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "../_lib/cn";

export interface MagneticDropZoneProps {
  onFiles?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  /** How far (px) the zone leans toward an incoming drag. */
  pull?: number;
  className?: string;
}

const formatSize = (bytes: number) =>
  bytes < 1024 ? `${bytes} B` : bytes < 1024 ** 2 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 ** 2).toFixed(1)} MB`;

/**
 * A file target that leans toward the dragged file before it lands, then
 * catches it with a little bounce. Click or press Enter to browse instead.
 */
export function MagneticDropZone({ onFiles, accept, multiple = true, pull = 14, className }: MagneticDropZoneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const depth = useRef(0);
  const [over, setOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });

  const lean = (clientX: number, clientY: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const dx = (clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (clientY - (r.top + r.height / 2)) / (r.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * pull);
    y.set(Math.max(-1, Math.min(1, dy)) * pull);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const accept_ = (list: FileList | null) => {
    const next = Array.from(list ?? []);
    if (next.length === 0) return;
    setFiles((f) => (multiple ? [...next, ...f].slice(0, 5) : next.slice(0, 1)));
    onFiles?.(next);
  };

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <motion.div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label="Upload files: drop here or press Enter to browse"
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), input.current?.click())}
        onDragEnter={(e) => {
          e.preventDefault();
          depth.current += 1;
          setOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          lean(e.clientX, e.clientY);
        }}
        onDragLeave={() => {
          depth.current -= 1;
          if (depth.current <= 0) {
            depth.current = 0;
            setOver(false);
            reset();
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          depth.current = 0;
          setOver(false);
          reset();
          accept_(e.dataTransfer.files);
        }}
        style={{ x, y }}
        animate={{ scale: over ? 1.03 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "relative flex h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
          over
            ? "border-neutral-900 bg-neutral-900/[0.03] dark:border-white dark:bg-white/5"
            : "border-neutral-300 bg-white hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-950"
        )}
      >
        <motion.div
          animate={over ? { y: -4, rotate: -6 } : { y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path d="M12 16V4m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" strokeLinecap="round" />
          </svg>
        </motion.div>
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-900 dark:text-white">{over ? "Let go to drop" : "Drop a file here"}</p>
          <p className="text-xs text-neutral-500">or click to browse</p>
        </div>
        <input
          ref={input}
          type="file"
          className="sr-only"
          tabIndex={-1}
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            accept_(e.target.files);
            e.target.value = "";
          }}
        />
      </motion.div>

      <ul className="mt-3 space-y-2">
        <AnimatePresence initial={false}>
          {files.map((f, i) => (
            <motion.li
              key={`${f.name}-${f.size}-${i}`}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950"
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-neutral-100 font-mono text-[9px] uppercase text-neutral-500 dark:bg-neutral-800">
                {f.name.split(".").pop()?.slice(0, 4) || "file"}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-neutral-800 dark:text-neutral-200">{f.name}</span>
              <span className="text-xs tabular-nums text-neutral-400">{formatSize(f.size)}</span>
              <button
                type="button"
                aria-label={`Remove ${f.name}`}
                onClick={() => setFiles((all) => all.filter((_, j) => j !== i))}
                className="rounded p-0.5 text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
              >
                ×
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
