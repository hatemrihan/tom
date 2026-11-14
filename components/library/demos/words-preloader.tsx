"use client";

import { WordsPreloader } from "../words-preloader/words-preloader";

export default function WordsPreloaderDemo() {
  return (
    <WordsPreloader className="h-[420px] w-full rounded-2xl" words={["Hello", "أهلاً", "Bonjour", "Ciao", "Hola", "こんにちは", "Hallo", "Olá"]}>
      {/* Your page goes here. */}
      <div className="relative h-full bg-white text-[11px] font-medium uppercase leading-[1.35] tracking-[0.01em] text-neutral-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/people/curie.jpg" alt="Marie Curie, c. 1920" className="absolute left-1/2 top-1/2 h-[230px] w-[180px] -translate-x-1/2 -translate-y-1/2 object-cover object-[50%_18%] grayscale" />
        <p className="absolute left-5 top-4">Index&nbsp;&nbsp;Work&nbsp;&nbsp;Archive</p>
        <p className="absolute right-5 top-4 text-neutral-500">Marie Curie, c. 1920</p>
        <p className="absolute bottom-4 left-5">©2026 TOM</p>
        <p className="absolute bottom-4 right-5">Wikimedia Commons</p>
      </div>
    </WordsPreloader>
  );
}
