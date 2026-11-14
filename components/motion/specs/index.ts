import type { MotionSpec } from "../types";
import { wordsPreloader } from "./words-preloader";

/** Every component that has a motion edition, by slug. */
export const specs: Record<string, MotionSpec> = {
  "words-preloader": wordsPreloader as unknown as MotionSpec,
};
