"use client";

import { ScrollSpyNav } from "../scroll-spy-nav/scroll-spy-nav";

const p = (t: string) => <p>{t}</p>;
const body =
  "Every project starts with a short call and a written proposal. Scope, deliverables and timeline are agreed up front so there are no surprises later.";

export default function ScrollSpyNavDemo() {
  return (
    <div className="h-[420px] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <ScrollSpyNav
        title="Agreement"
        sections={[
          { id: "intro", title: "Introduction", content: [p(body), p(body)] },
          { id: "scope", title: "Scope of work", content: [p(body), p(body), p(body)] },
          { id: "fees", title: "Fees & payments", content: [p(body), p(body)] },
          { id: "ip", title: "Intellectual property", content: [p(body), p(body), p(body)] },
          { id: "termination", title: "Termination", content: [p(body)] },
          { id: "contact", title: "Contact", content: [p("hatemrihann@gmail.com")] },
        ].map((s) => ({ ...s, content: <>{s.content.map((c, i) => <div key={i}>{c}</div>)}</> }))}
      />
    </div>
  );
}
