import First from "./sections/First";
import { registry } from "@/components/library/registry";
import { DocsNav } from "./components/_ui/DocsNav";
import { WorkWithMe } from "./components/_ui/DocsChrome";
import Work from "./sections/Work";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "TOM — Hatem Rihan, Software Engineer" },
  description:
    "Hatem Rihan (TOM) — software engineer building full-stack products, scalable systems and open-source React components.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
    <DocsNav count={registry.length} theme={false} surface="bg-white/85" />
    <First />
    <Work />
    <div className="bg-white px-6 pb-24 text-neutral-900">
      <WorkWithMe />
    </div>
    </>
  );
}
