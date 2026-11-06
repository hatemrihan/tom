"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CodeFile {
  label: string;
  target: string;
  code: string;
  html: string;
}

export function CopyButton({ text, className, label = "Copy" }: { text: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {}
      }}
      aria-label={copied ? "Copied" : label}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.97] dark:hover:bg-neutral-800 dark:hover:text-white",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="c" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Check className="size-3.5" /> Copied
          </motion.span>
        ) : (
          <motion.span key="i" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="flex items-center gap-1.5">
            <Copy className="size-3.5" /> {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function CodeTabs({ files }: { files: CodeFile[] }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const file = files[active];
  const long = file.code.split("\n").length > 28;

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center gap-1 border-b border-neutral-100 px-2 py-1.5 dark:border-neutral-900">
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none]">
          {files.map((f, i) => (
            <button
              key={f.label}
              type="button"
              onClick={() => {
                setActive(i);
                setExpanded(false);
              }}
              className={cn(
                "relative h-8 shrink-0 rounded-lg px-3 font-mono text-xs transition-colors",
                i === active ? "text-neutral-900 dark:text-white" : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              )}
            >
              {i === active && <motion.span layoutId="code-tab" className="absolute inset-0 rounded-lg bg-neutral-100 dark:bg-neutral-800" transition={{ type: "spring", bounce: 0.1, duration: 0.35 }} />}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>
        <CopyButton text={file.code} />
      </div>
      <p className="border-b border-neutral-100 px-4 py-2 font-mono text-[11px] text-neutral-400 dark:border-neutral-900">{file.target}</p>
      <div className="relative">
        <div
          className={cn("code-block overflow-auto text-[13px] leading-[1.7]", !expanded && long && "max-h-[460px] overflow-hidden")}
          dangerouslySetInnerHTML={{ __html: file.html }}
        />
        {long && (
          <div className={cn("flex justify-center", !expanded && "absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/90 to-transparent pb-4 pt-16 dark:from-neutral-950 dark:via-neutral-950/90")}>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="my-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600 shadow-sm transition hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
            >
              {expanded ? "Collapse" : "Expand code"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
