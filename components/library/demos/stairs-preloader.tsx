"use client";

import { StairsPreloader } from "../stairs-preloader/stairs-preloader";

export default function StairsPreloaderDemo() {
  return (
    <StairsPreloader className="h-72 w-full max-w-lg rounded-2xl">
      <div className="flex h-72 flex-col justify-end bg-[url('/images/FaragOne-image.png')] bg-cover bg-center p-6">
        <p className="text-3xl font-semibold tracking-tight text-white drop-shadow">Welcome in.</p>
      </div>
    </StairsPreloader>
  );
}
