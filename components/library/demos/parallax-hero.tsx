"use client";

import { useRef } from "react";
import { ParallaxHero } from "../parallax-hero/parallax-hero";

export default function ParallaxHeroDemo() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div ref={scroller} className="h-[460px] w-full overflow-y-auto rounded-2xl">
      <ParallaxHero
        container={scroller}
        image="/images/FaragOne-image.png"
        eyebrow="Photography · 2023"
        title="Farag Studio"
        body="A minimalist identity for a photography studio — Three.js, GSAP and a lot of white space."
      />
    </div>
  );
}
