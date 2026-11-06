"use client";

import { useEffect, useState } from "react";
import { LogoTraceLoader } from "../logo-trace-loader/logo-trace-loader";

export default function LogoTraceLoaderDemo() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 3200);
    return () => clearTimeout(t);
  }, []);
  return <LogoTraceLoader done={done} />;
}
