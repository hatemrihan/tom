"use client";

import { VideoPlayer } from "../video-player/video-player";

export default function VideoPlayerDemo() {
  return <VideoPlayer src="/videos/nader.mp4" poster="/videos/nader-poster.jpg" title="NE Coaching — product walkthrough" className="max-w-lg" />;
}
