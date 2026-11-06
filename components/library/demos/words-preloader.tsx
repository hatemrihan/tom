"use client";

import { WordsPreloader } from "../words-preloader/words-preloader";

export default function WordsPreloaderDemo() {
  return (
    <WordsPreloader className="h-72 w-full max-w-lg rounded-2xl">
      <div className="flex h-72 flex-col justify-end bg-[url('/images/UnlimitedOne-image.jpg')] bg-cover bg-center p-6">
        <p className="text-3xl font-semibold tracking-tight text-white drop-shadow">Hi, I&apos;m Hatem.</p>
      </div>
    </WordsPreloader>
  );
}
