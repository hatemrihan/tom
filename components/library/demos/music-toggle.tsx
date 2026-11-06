"use client";

import { MusicToggle } from "../music-toggle/music-toggle";

export default function MusicToggleDemo() {
  // Pass src="/audio/ambient.mp3" to loop a real track.
  return <MusicToggle defaultOn />;
}
