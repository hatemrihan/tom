"use client";

import { useRef } from "react";
import { ScrollImageExpand } from "../scroll-image-expand/scroll-image-expand";

export default function ScrollImageExpandDemo() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div ref={scroller} className="relative h-[440px] w-full overflow-y-auto rounded-2xl bg-neutral-950">
      <ScrollImageExpand
        container={scroller}
        hero="/images/UnlimitedOne-image.jpg"
        caption="Unlimited"
        around={[
          "/images/JayashOne-image.jpg", "/images/FaragOne-image.png", "/images/NaderOne-image.png", "/images/JayashThree-image.png",
          "/images/FaragThree-image.png", "/images/NaderTwo-image.png", "/images/hatem-image.jpg", "/images/UnlimitedThree-image.png",
        ]}
      />
    </div>
  );
}
