import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import NavigationEvents from "@/components/NavigationEvents";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://safargold.com"),
  title: {
    default: "Safar Gold — Jual Beli Emas Terpercaya, Harga Real-time",
    template: "%s | Safar Gold",
  },
  description:
    "Harga emas terkini setiap hari — Antam, UBS, dan perhiasan. Kalkulator jual beli emas praktis, transparan, dan terpercaya. Update otomatis pukul 06:00 WIB.",
  keywords: [
    "jual beli emas",
    "harga emas hari ini",
    "buyback emas",
    "harga emas antam",
    "harga emas ubs",
    "kalkulator emas",
    "investasi emas",
    "safar gold",
  ],
  authors: [{ name: "Safar Gold" }],
  creator: "Safar Gold",
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://safargold.com",
    siteName: "Safar Gold",
    title: "Safar Gold — Jual Beli Emas Terpercaya, Harga Real-time",
    description:
      "Harga emas terkini setiap hari — Antam, UBS, dan perhiasan. Kalkulator jual beli emas praktis, transparan, dan terpercaya.",
    images: [
      {
        url: "/safar-hero.webp",
        width: 1200,
        height: 630,
        alt: "Safar Gold — Jual Beli Emas Terpercaya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Safar Gold — Jual Beli Emas Terpercaya",
    description:
      "Harga emas terkini setiap hari. Kalkulator jual beli emas praktis, transparan, dan terpercaya.",
    images: ["/safar-hero.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Suspense><NavigationEvents /></Suspense>
        {children}
      </body>
    </html>
  );
}
