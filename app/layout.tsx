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
    default: "TOM - Creative Designer & Developer Portfolio",
    template: "%s | TOM Portfolio"
  },
  description: "TOM is a creative designer and developer specializing in modern web design, UI/UX, and innovative digital experiences. Explore my portfolio of stunning projects and get in touch for collaborations.",
  keywords: ["TOM", "portfolio", "web design", "UI/UX designer", "creative developer", "web developer", "digital designer", "Hatem", "modern web design"],
  authors: [{ name: "TOM", url: "https://yourdomainhere.com" }],
  creator: "TOM",
  publisher: "TOM",
  
  // Open Graph metadata (for social media sharing)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomainhere.com",
    siteName: "TOM Portfolio",
    title: "TOM - Creative Designer & Developer Portfolio",
    description: "Explore TOM's portfolio of stunning web design and development projects. Specializing in modern UI/UX and innovative digital experiences.",
    images: [
      {
        url: "/logo.png", // Replace with your logo
        width: 1200,
        height: 630,
        alt: "TOM Portfolio Logo",
      }
    ],
  },
  
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "TOM - Creative Designer & Developer Portfolio",
    description: "Explore TOM's portfolio of stunning web design and development projects.",
    images: ["/logo.png"], // Replace with your logo
    creator: "@yourtwitter", // Add your Twitter handle
  },
  
  // Icons and manifest
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
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
  metadataBase: new URL("https://yourdomainhere.com"), // Replace with your actual domain
  alternates: {
    canonical: "https://yourdomainhere.com",
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
    url: "https://yourdomainhere.com",
    jobTitle: "Creative Designer & Developer",
    description: "Creative designer and developer specializing in modern web design, UI/UX, and innovative digital experiences.",
    image: "https://yourdomainhere.com/logo.png",
    sameAs: [
      "https://twitter.com/yourtwitter",
      "https://linkedin.com/in/yourlinkedin",
      "https://github.com/yourgithub",
      // Add your social media links
    ],
    knowsAbout: ["Web Design", "UI/UX Design", "Web Development", "Creative Design", "Digital Design"],
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
