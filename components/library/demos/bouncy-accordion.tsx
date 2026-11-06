"use client";

import { BouncyAccordion } from "../bouncy-accordion/bouncy-accordion";

export default function BouncyAccordionDemo() {
  return (
    <BouncyAccordion
      items={[
        { title: "Are the components free?", content: "Yes — every component is MIT licensed. Use them in personal and commercial projects." },
        { title: "Do I need a package?", content: "No. Each component is a single file you copy into your project. An npm package is coming." },
        { title: "Which stack do they use?", content: "React, TypeScript, Tailwind CSS and Motion. Nothing else unless stated on the page." },
        { title: "Can you build one for me?", content: "Absolutely — use the contact page and tell me what you have in mind." },
      ]}
    />
  );
}
