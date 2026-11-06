"use client";

import { AiInput } from "../ai-input/ai-input";

export default function AiInputDemo() {
  return <AiInput placeholder="What should we build today?" onSubmit={(v) => new Promise((r) => setTimeout(() => r(console.log(v)), 1400))} />;
}
