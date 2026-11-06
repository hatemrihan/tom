import type { Metadata } from "next";
import { Dock } from "./_ui/Dock";

export const metadata: Metadata = {
  title: {
    default: "Components — open-source React UI by Hatem Rihan",
    template: "%s — TOM Components",
  },
  description:
    "Open-source React components with motion — buttons, text effects, cards, backgrounds and more. TypeScript + Tailwind CSS, free to copy and use.",
  alternates: { canonical: "/components" },
  openGraph: {
    title: "TOM Components",
    description: "Open-source, motion-rich React components. Copy, paste, ship.",
    url: "/components",
  },
};

// Applies the saved docs theme before first paint (no flash).
const themeScript = `(function(){try{var t=localStorage.getItem('tom-docs-theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.getElementById('docs-root').classList.add('dark');}catch(e){}})();`;

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="docs-root" suppressHydrationWarning className="font-sans">
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <div className="min-h-dvh bg-[#fafafa] text-neutral-900 antialiased transition-colors dark:bg-[#0a0a0a] dark:text-neutral-100">
        {children}
        <Dock />
      </div>
    </div>
  );
}
