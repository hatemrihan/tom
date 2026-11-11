import { registry } from "@/components/library/registry";
import { DocsNav } from "../components/_ui/DocsNav";
import { WorkWithMe } from "../components/_ui/DocsChrome";
import { site } from "@/lib/site";
import { Mark } from "../components/_ui/Mark";
import { ContactForm } from "./ContactForm";

const AGREEMENT: { title: string; clauses: string[] }[] = [
  {
    title: "Intro",
    clauses: [
      "This Client Agreement (“Agreement”) is entered into between the Client (the “Client”) and Tom, a development studio based in Egypt (“Tom”).",
      "Any use of “I” refers to design concepts, development, branding, ideas, materials and any and all work that results from a project.",
      "By engaging Tom for development or design services, the Client agrees to the terms and conditions outlined in this Agreement.",
    ],
  },
  {
    title: "Scope of work",
    clauses: [
      "Tom agrees to provide development/design services as outlined in the proposal signed by both parties. Scope, deliverables and timeline are detailed in that proposal.",
      "Two (2) rounds of revisions are included in the quoted price. Further revisions are charged at the hourly rate specified in the proposal.",
    ],
  },
  {
    title: "Fees and payments",
    clauses: [
      "Payment terms: the Client agrees to pay the total project fee in the proposal — 50% upfront deposit, remaining balance due on completion.",
      "Late payments: invoices are due within 30 days. Late payments may incur a 1.5% monthly service charge.",
      "Additional work: anything beyond the agreed scope is billed separately at the standard hourly rate.",
    ],
  },
  {
    title: "Project management",
    clauses: [
      "Communication happens via email and scheduled video calls. The Client agrees to respond to requests for information within 5 business days.",
      "Timelines are estimates based on receiving timely feedback and materials from the Client.",
      "All final files are delivered electronically in the formats specified in the proposal.",
    ],
  },
  {
    title: "Termination",
    clauses: [
      "Either party may terminate with 14 days written notice. The Client is billed for work completed up to the termination date.",
      "Upon termination, completed work becomes the Client’s property once all outstanding invoices are paid.",
      "Tom may terminate immediately in case of non-payment or breach of contract.",
    ],
  },
  {
    title: "Conflict of interest",
    clauses: [
      "Tom will disclose any potential conflicts of interest before beginning work and obtain written consent to proceed.",
      "Tom will not work on directly competing projects during this agreement without prior written consent.",
      "Conflicts of interest are resolved in favour of the Client’s best interests.",
    ],
  },
  {
    title: "Confidentiality",
    clauses: [
      "Both parties keep proprietary information shared during the project confidential.",
      "Tom will not disclose confidential business information, trade secrets or proprietary data without written consent.",
      "Confidentiality remains in effect for 5 years after project completion.",
    ],
  },
  {
    title: "Indemnification",
    clauses: [
      "The Client indemnifies and holds harmless the studio from claims arising from use of the completed work.",
      "Tom’s liability is limited to the total amount paid for the project.",
      "Neither party is liable for indirect, incidental or consequential damages.",
    ],
  },
  {
    title: "Sub-contractors",
    clauses: [
      "Tom may engage qualified sub-contractors, subject to the same confidentiality and quality standards.",
      "All sub-contractors are bound by the terms of this agreement.",
      "Tom remains fully responsible for work performed by sub-contractors.",
    ],
  },
  {
    title: "Intellectual property",
    clauses: [
      "Ownership: upon full payment the Client owns the final delivered work. Tom retains rights to preliminary concepts, sketches and unused designs.",
      "Portfolio rights: Tom may display completed work in portfolios, websites and promotional materials.",
      "Third-party assets: stock photography, fonts or other third-party materials require separate licensing by the Client.",
    ],
  },
  {
    title: "Terms and conditions",
    clauses: [
      "Governing law: this agreement is governed by the laws of Egypt; disputes are resolved through arbitration.",
      "Force majeure: neither party is liable for delays caused by circumstances beyond reasonable control.",
      "Amendments must be made in writing and signed by both parties.",
    ],
  },
  {
    title: "Acceptance of agreement",
    clauses: [
      "By signing or making payment, the Client acknowledges they have read, understood and agree to be bound by this agreement.",
      "This agreement becomes effective on signature by both parties or on receipt of initial payment, whichever comes first.",
    ],
  },
];

export default function ContactPage() {
  return (
    <>
      <DocsNav count={registry.length} theme={false} surface="bg-white/85" />

      <main className="min-h-dvh bg-white px-6 pb-28 text-[11px] font-medium uppercase leading-[1.35] tracking-[0.01em] text-neutral-900 sm:px-10">
        {/* the same quiet opening as the home page */}
        <section aria-label="Contact" className="flex flex-col items-center pt-28 sm:pt-36">
          <Mark className="size-16" />
          <div className="mt-5 grid grid-cols-1 gap-x-9 gap-y-4 text-center leading-[1.25] sm:grid-cols-2 sm:text-left">
            <div className="sm:text-right">
              <h1>
                Get in touch
                <br />
                It takes a minute
              </h1>
            </div>
            <div>
              <p>
                Or write to
                <br />
                <a href={`mailto:${site.email}`} className="underline underline-offset-4">
                  {site.email}
                </a>
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-20 max-w-xl sm:mt-24">
          <ContactForm />
        </div>

        {/* how I work, folded away until someone wants it */}
        <section aria-labelledby="agreement-title" className="mx-auto mt-32 max-w-xl">
          <h2 id="agreement-title">Client agreement</h2>
          <p className="mt-1 font-normal text-neutral-500">The short version of how I work. Every project also gets a proposal signed by both of us.</p>

          <div className="mt-6 border-t border-neutral-200">
            {AGREEMENT.map((section, i) => (
              <details key={section.title} className="group border-b border-neutral-200">
                <summary className="flex cursor-pointer list-none items-center gap-4 py-3 [&::-webkit-details-marker]:hidden">
                  <span className="w-5 font-normal tabular-nums text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">{section.title}</span>
                  <span aria-hidden className="font-normal text-neutral-400 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <ol className="space-y-2 pb-5 pl-9 pr-4 text-[12px] font-normal normal-case leading-[1.45] tracking-normal text-neutral-600">
                  {section.clauses.map((clause, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="shrink-0 tabular-nums text-neutral-400">
                        {i + 1}.{j + 1}
                      </span>
                      <span>{clause}</span>
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </div>
        </section>

        <WorkWithMe />
      </main>
    </>
  );
}
