import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { Providers } from "@/components/Providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://01fe19bcs117-hwa-hackathon.vercel.app"),
  title: {
    default: "REWEAR — Wear the future. Waste nothing.",
    template: "%s — REWEAR",
  },
  description:
    "REWEAR is a circular fashion system. Future-facing outerwear, conductive knits and modular accessories made from regenerated fibre — every piece traceable, repairable and designed to return.",
  keywords: [
    "REWEAR",
    "sustainable fashion",
    "circular fashion",
    "techwear",
    "recycled outerwear",
    "AI style match",
    "futuristic clothing",
  ],
  applicationName: "REWEAR",
  authors: [{ name: "REWEAR Systems" }],
  creator: "REWEAR Systems",
  openGraph: {
    type: "website",
    siteName: "REWEAR",
    title: "REWEAR — Wear the future. Waste nothing.",
    description:
      "A circular fashion system. Regenerated-fibre outerwear, conductive knits and modular accessories, traceable from thread to re-spin.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "REWEAR — Wear the future. Waste nothing.",
    description: "Future-facing fashion, engineered to return.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body className="min-h-screen bg-void text-chrome">
        <a
          href="#main"
          className="sr-only z-[100] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-full focus:bg-violet focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-void"
        >
          Skip to content
        </a>
        <Providers>
          <ScrollProgress />
          <Header />
          <main id="main" className="min-h-[60vh]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
