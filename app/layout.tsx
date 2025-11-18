import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: "TOM -  Designer & Developer Portfolio",
    template: "%s | TOM Portfolio"
  },
  description: "TOM is a  designer and developer specializing in modern web design, UI/UX, and innovative digital experiences. Explore my portfolio of stunning projects and get in touch for collaborations.",
  keywords: ["TOM", "portfolio", "web design", "UI/UX designer", " developer", "web developer", "digital designer", "Hatem", "modern web design"],
  authors: [{ name: "TOM", url: "https://tomm.one" }],
  creator: "TOM",
  publisher: "TOM",
  
  // Open Graph metadata (for social media sharing)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tomm.one",
    siteName: "TOM Portfolio",
    title: "TOM -  Designer & Developer Portfolio",
    description: "Explore TOM's portfolio of stunning web design and development projects. Specializing in modern UI/UX and innovative digital experiences.",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "TOM Portfolio Logo",
      }
    ],
  },
  
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "TOM -  Designer & Developer Portfolio",
    description: "Explore TOM's portfolio of stunning web design and development projects.",
    images: ["/logo.svg"],
    creator: "@yourtwitter", // Add your Twitter handle
  },
  
  // Icons and manifest
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  
  // Verification for search engines
  verification: {
    google: "your-google-verification-code", // Add after domain setup
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  
  // Robots
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
  
  // Additional metadata
  metadataBase: new URL("https://tomm.one"),
  alternates: {
    canonical: "https://tomm.one",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data for rich snippets in search results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "TOM (Hatem)",
    url: "https://tomm.one",
    jobTitle: " Designer & Developer",
    description: " designer and developer specializing in modern web design, UI/UX, and innovative digital experiences.",
    image: "https://tomm.one/logo.svg",
    sameAs: [
      "https://twitter.com/yourtwitter",
      "https://linkedin.com/in/yourlinkedin",
      "https://github.com/yourgithub",
      // Add your social media links
    ],
    knowsAbout: ["Web Design", "UI/UX Design", "Web Development", " Design", "Digital Design"],
  };

  return (
    <html lang="en">
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
