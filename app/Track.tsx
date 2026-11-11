"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/track";

/** Counts a page view each time the page changes. Renders nothing. */
export function Track() {
  const pathname = usePathname();
  useEffect(() => {
    track("view");
  }, [pathname]);
  return null;
}
