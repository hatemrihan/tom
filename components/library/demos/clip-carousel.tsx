"use client";

import { ClipCarousel } from "../clip-carousel/clip-carousel";

export default function ClipCarouselDemo() {
  return (
    <ClipCarousel
      autoplay={3500}
      slides={[
        { src: "/images/JayashOne-image.jpg", title: "Jayash — Album identity" },
        { src: "/images/UnlimitedOne-image.jpg", title: "Unlimited — Store" },
        { src: "/images/hatem-image.jpg", title: "Hatem — Studio" },
        { src: "/images/FaragOne-image.png", title: "Farag — Photography" },
        { src: "/images/NaderOne-image.png", title: "NE — Coaching" },
        { src: "/images/JayashThree-image.png", title: "Jayash — Merch" },
      ]}
    />
  );
}
