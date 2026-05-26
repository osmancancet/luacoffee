import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || site.url),
  title: {
    default: "Lua Coffee · Soma, Manisa'da Üçüncü Nesil Kahve",
    template: "%s · Lua Coffee",
  },
  description:
    "Lua Coffee — Soma, Manisa'da üçüncü nesil kahve. Özenle hazırlanan espresso bazlı kahveler, imza içecekler, gece temalı atmosfer ve QR ile katılabileceğin fotoğraf yarışması. Topçu Sokak'tayız.",
  keywords: [...site.anahtarKelimeler],
  applicationName: site.ad,
  authors: [{ name: site.ad }],
  creator: site.ad,
  alternates: { canonical: "/" },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: site.url,
    siteName: site.ad,
    title: "Lua Coffee · Soma, Manisa'da Üçüncü Nesil Kahve",
    description:
      "Soma, Manisa'da özenle hazırlanan kahveler, imza içecekler ve gece temalı atmosfer. Ayın altında bir kahve molası.",
    images: [
      {
        url: "/galeri/dis-cephe-2.webp",
        width: 1200,
        height: 800,
        alt: "Lua Coffee — Soma, Manisa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lua Coffee · Soma, Manisa",
    description: "Soma, Manisa'da üçüncü nesil kahve. Ayın altında bir kahve molası.",
    images: ["/galeri/dis-cephe-2.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body
        className={`${inter.variable} ${playfair.variable} flex min-h-screen flex-col antialiased`}
      >
        <JsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
