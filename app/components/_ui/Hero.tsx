"use client";

import { motion, useReducedMotion } from "motion/react";
import { Mark } from "./Mark";

/** A quiet, centred opening: the mark and a few small lines of text. */
export function Hero({ count, handle }: { count: number; handle: string }) {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 10 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="-mt-[72px] flex h-[min(100svh,760px)] min-h-[520px] w-full flex-col items-center justify-center px-6 text-neutral-900 dark:text-white">
      <motion.div {...rise(0)}>
        <Mark className="size-16" />
      </motion.div>

      <motion.div
        {...rise(0.12)}
        className="mt-5 grid grid-cols-1 gap-x-9 gap-y-4 text-center text-[11px] font-medium uppercase leading-[1.25] tracking-[0.01em] sm:grid-cols-2 sm:text-left"
      >
        <div className="sm:text-right">
          <h1>
            Open-source React components
            <br />
            with motion, detail and feel
          </h1>
          <p className="mt-2.5 font-normal text-neutral-500">
            TOM
            <br />
            ©{new Date().getFullYear()}
          </p>
        </div>
        <div>
          <p>
            Copy the code,
            <br />
            make it yours
          </p>
          <p className="mt-2.5">
            {count} components
            <br />
            MIT licensed
            <br />
            {handle}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
