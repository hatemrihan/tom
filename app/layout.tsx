import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Open_Sans, Special_Gothic_Expanded_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "800"],
  display: "swap",
});
const display = Special_Gothic_Expanded_One({
  variable: "--font-special-gothic",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const SITE_URL = "https://tomm.one";
const SOCIAL = {
  x: "https://x.com/hatemrihan",
  instagram: "https://www.instagram.com/hatemrihann",
  linkedin: "https://www.linkedin.com/in/hatem-rihan-298753309",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TOM — Hatem Rihan, Software Engineer",
    template: "%s | TOM",
  },
  description:
    "TOM (Hatem Rihan) is a software engineer and design engineer building full-stack products, scalable systems and open-source React components.",
  keywords: [
    "TOM",
    "Hatem Rihan",
    "portfolio",
    "software engineer",
    "design engineer",
    "full-stack developer",
    "React components",
    "open source",
    "Next.js",
    "Tailwind CSS",
  ],
  authors: [{ name: "Hatem Rihan", url: SITE_URL }],
  creator: "Hatem Rihan",
  publisher: "Hatem Rihan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "TOM",
    title: "TOM — Hatem Rihan, Software Engineer",
    description:
      "Full-stack products, scalable systems and open-source React components by Hatem Rihan.",
    images: [{ url: "/logo.svg", alt: "TOM" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TOM — Hatem Rihan, Software Engineer",
    description: "Full-stack products and open-source React components.",
    images: ["/logo.svg"],
    creator: "@hatemrihan",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
};

export const viewport: Viewport = {
  themeColor: "#f2f2f2",
  width: "device-width",
  initialScale: 1,
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hatem Rihan",
  alternateName: "TOM",
  url: SITE_URL,
  jobTitle: "Software Engineer",
  description:
    "Software engineer specializing in full-stack development, system architecture and interactive UI.",
  image: `${SITE_URL}/logo.svg`,
  sameAs: Object.values(SOCIAL),
  knowsAbout: [
    "Software Engineering",
    "Full-Stack Development",
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "System Design",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} ${display.variable} antialiased overflow-x-hidden`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
