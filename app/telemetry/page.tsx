import type { Metadata } from "next";
import { registry } from "@/components/library/registry";
import { DocsNav } from "../components/_ui/DocsNav";
import { WorkWithMe } from "../components/_ui/DocsChrome";

export const metadata: Metadata = {
  title: "Telemetry",
  description: "What TOM counts, what it never collects, and how to turn it off.",
  alternates: { canonical: "/telemetry" },
};

const SECTIONS: { title: string; lines: string[] }[] = [
  {
    title: "Why",
    lines: ["I build these components alone. Counting which ones people use tells me which to improve, which to port next, and whether anyone is out there at all."],
  },
  {
    title: "What the tools send",
    lines: [
      "When you run npx tomm-ui add or dart run tomm add, the tool sends: the names of the components you added, the tool's version, your operating system (for example macOS), your Node or Dart version, your package manager, and whether it ran in CI.",
      "It also sends a random id that the tool made up the first time it ran and keeps in ~/.config/tomm/id. It lets me count people instead of commands. It is not tied to your name, your machine's name or any account.",
    ],
  },
  {
    title: "What this site counts",
    lines: [
      "Which pages are opened, which code or commands are copied, and whether TypeScript or Dart is chosen. To count visitors without a cookie, the server makes a one-way hash that changes every day; your address itself is not kept.",
      "The country is taken from the request, and the site you came from is kept as a domain only.",
    ],
  },
  {
    title: "What is never collected",
    lines: [
      "Your name, email, username, IP address, project name, file paths, environment variables, or any of your code.",
      "The components themselves contain no tracking. Once a component is in your app, by install or by copy, it sends nothing to anyone. Your users are never counted.",
    ],
  },
  {
    title: "Turning it off",
    lines: [
      "Tools: set TOMM_TELEMETRY=0 or DO_NOT_TRACK=1 in your environment, or pass --no-telemetry. The tool then sends nothing.",
      "Site: turn on Do Not Track in your browser and nothing is counted.",
    ],
  },
];

export default function TelemetryPage() {
  return (
    <>
      <DocsNav count={registry.length} theme={false} surface="bg-white/85" />
      <main className="min-h-dvh bg-white px-6 pb-28 pt-28 text-[11px] font-medium uppercase leading-[1.35] tracking-[0.01em] text-neutral-900 sm:px-10 sm:pt-36">
        <div className="mx-auto max-w-xl">
          <h1>Telemetry</h1>
          <p className="font-normal text-neutral-500">What is counted, what never is, and how to turn it off</p>

          <div className="mt-12 space-y-10">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-neutral-500">{section.title}</h2>
                <div className="mt-2 space-y-3 text-[13px] font-normal normal-case leading-[1.55] tracking-normal">
                  {section.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        <WorkWithMe />
      </main>
    </>
  );
}
