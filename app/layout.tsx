// app/layout.tsx
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import Providers from "./(auth)/providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "REACTiONS - Download Trending Video Memes & Reactions",
    template: "%s | REACTiONS",
  },
  description:
    "Discover, watch, and download the best video memes, reaction clips, and funny moments for your content creation. High quality, watermark-free.",
  keywords: [
    "REACTiONS",
    "video memes",
    "reaction videos",
    "meme downloads",
    "funny clips",
    "content creation",
    "viral videos",
    "meme database",
  ],
  authors: [{ name: "REACTiONS Team" }],
  creator: "REACTiONS",
  publisher: "REACTiONS",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "REACTiONS",
    title: "REACTiONS - The Ultimate Video Meme Library",
    description:
      "Find the perfect reaction video for your next post. Search thousands of high-quality, trimmed video memes.",
    images: [
      {
        url: "/og-image.jpg", // We should probably ensure this exists or use a generic one
        width: 1200,
        height: 630,
        alt: "REACTiONS - Video Memes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "REACTiONS - Video Meme Downloads",
    description:
      "Download trending video memes and reactions for your content.",
    images: ["/og-image.jpg"],
    creator: "@reactions",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <div className="flex flex-col min-h-screen relative z-10">
            <div className="container flex-1">
              <Header />
              <main className="mt-8">{children}</main>
            </div>
            <Footer />
            <BackToTop />
          </div>
        </Providers>
      </body>
    </html>
  );
}
