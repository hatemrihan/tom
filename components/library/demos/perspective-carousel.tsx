"use client";

import { PerspectiveCarousel } from "../perspective-carousel/perspective-carousel";

export default function PerspectiveCarouselDemo() {
  return (
    <PerspectiveCarousel
      slides={[
        { src: "/images/JayashOne-image.jpg", title: "Jayash" },
        { src: "/images/UnlimitedOne-image.jpg", title: "Unlimited" },
        { src: "/images/FaragOne-image.png", title: "Farag" },
        { src: "/images/NaderOne-image.png", title: "NE Coach" },
        { src: "/images/hatem-image.jpg", title: "Hatem" },
        { src: "/images/FaragThree-image.png", title: "Farag — Studio" },
      ]}
    />
  );
}
