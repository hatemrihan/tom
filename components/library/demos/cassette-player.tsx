"use client";

import { CassettePlayer } from "../cassette-player/cassette-player";

export default function CassettePlayerDemo() {
  // Pass `src="/audio/track.mp3"` to play a real file.
  return <CassettePlayer title="Late Night Sketches" side="A" duration={84} />;
}
