"use client";

import { FanGallery } from "../fan-gallery/fan-gallery";

export default function FanGalleryDemo() {
  return (
    <FanGallery
      images={[
        { src: "/images/JayashOne-image.jpg", alt: "Jayash — album identity" },
        { src: "/images/UnlimitedOne-image.jpg", alt: "Unlimited — e‑commerce" },
        { src: "/images/FaragOne-image.png", alt: "Farag — photography studio" },
        { src: "/images/NaderOne-image.png", alt: "Nader — coaching platform" },
        { src: "/images/hatem-image.jpg", alt: "Hatem" },
      ]}
    />
  );
}
