"use client";

import { SoapBubbleButton } from "../soap-bubble-button/soap-bubble-button";

export default function SoapBubbleButtonDemo() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-100 via-white to-pink-100 p-6 dark:from-sky-950 dark:via-neutral-950 dark:to-pink-950">
      <SoapBubbleButton>Pop me</SoapBubbleButton>
    </div>
  );
}
