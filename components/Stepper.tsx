"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface StepDefinition {
  /** Short label shown under the indicator. */
  title: string;
  content: ReactNode;
}

interface StepperProps {
  steps: StepDefinition[];
  /** Return false to block advancing (e.g. validation failed). */
  onBeforeNext?: (step: number) => boolean;
  /** Called when the user confirms on the last step. */
  onComplete: () => void | Promise<void>;
  onStepChange?: (step: number) => void;
  completeLabel?: string;
  nextLabel?: string;
  backLabel?: string;
  busy?: boolean;
  className?: string;
}

/**
 * Accessible multi-step container with animated height + slide transitions.
 * Steps are zero-indexed. Only already-visited steps are clickable.
 */
export default function Stepper({
  steps,
  onBeforeNext,
  onComplete,
  onStepChange,
  completeLabel = "Submit",
  nextLabel = "Continue",
  backLabel = "Back",
  busy = false,
  className,
}: StepperProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [visited, setVisited] = useState(0);
  const isLast = step === steps.length - 1;

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    setVisited((v) => Math.max(v, next));
    onStepChange?.(next);
  };

  const handleNext = async () => {
    if (busy) return;
    if (onBeforeNext && !onBeforeNext(step)) return;
    if (isLast) await onComplete();
    else go(step + 1);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Indicators */}
      <ol className="mb-10 flex items-center" aria-label="Progress">
        {steps.map((s, i) => {
          const state = i === step ? "active" : i < step ? "complete" : "upcoming";
          const clickable = i !== step && i <= visited && !busy;
          return (
            <li key={s.title} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && go(i)}
                aria-current={state === "active" ? "step" : undefined}
                className="group flex items-center gap-2.5 disabled:cursor-default"
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium tabular-nums transition-colors duration-300",
                    state === "upcoming" && "border-[#3b4a6b]/25 text-[#3b4a6b]/50",
                    state !== "upcoming" && "border-[#3b4a6b] bg-[#3b4a6b] text-white"
                  )}
                >
                  {state === "complete" ? <CheckIcon /> : i + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-[11px] uppercase tracking-[0.18em] transition-colors sm:block",
                    state === "upcoming" ? "text-[#3b4a6b]/45" : "text-[#3b4a6b]",
                    clickable && "group-hover:underline"
                  )}
                >
                  {s.title}
                </span>
              </button>
              {i < steps.length - 1 && (
                <span className="relative mx-3 h-px flex-1 overflow-hidden bg-[#3b4a6b]/15">
                  <motion.span
                    className="absolute inset-0 origin-left bg-[#3b4a6b]"
                    initial={false}
                    animate={{ scaleX: i < step ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <StepViewport step={step} direction={direction}>
        {steps[step]?.content}
      </StepViewport>

      <div className={cn("mt-12 flex items-center", step > 0 ? "justify-between" : "justify-end")}>
        {step > 0 && (
          <button
            type="button"
            onClick={() => go(step - 1)}
            disabled={busy}
            className="text-sm uppercase tracking-[0.14em] text-[#3b4a6b]/60 transition hover:text-[#3b4a6b] disabled:opacity-40"
          >
            ← {backLabel}
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={busy}
          className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#3b4a6b] px-6 text-sm uppercase tracking-[0.14em] text-white transition hover:bg-[#2c3852] active:scale-[0.98] disabled:opacity-60"
        >
          {busy ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Sending
            </>
          ) : (
            <>
              {isLast ? completeLabel : nextLabel}
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function StepViewport({
  step,
  direction,
  children,
}: {
  step: number;
  direction: number;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  // Track the active step's height so the container animates smoothly.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [step]);

  const offset = reduce ? 0 : 40;

  return (
    <motion.div
      className="relative"
      animate={{ height }}
      transition={{ type: "spring", duration: 0.45, bounce: 0 }}
      style={{ overflow: "clip", overflowClipMargin: 8 } as React.CSSProperties}
    >
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.div
          key={step}
          ref={ref}
          custom={direction}
          initial={{ x: direction * offset, opacity: 0, filter: "blur(4px)" }}
          animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ x: -direction * offset, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={3}>
      <motion.path
        d="M5 13l4 4L19 7"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </svg>
  );
}
