import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LangProvider } from "@/lib/langContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://talkcars.ai"; // update to your real domain

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  /* ─── Title ─────────────────────────────────────────── */
  title: {
    default: "Talk Cars — AI Car Chat Assistant | مساعد السيارات الذكي | Assistant Auto IA | Araba AI",
    template: "%s | Talk Cars AI",
  },

  /* ─── Description (primary: English, multilingual hints) */
  description:
    "Talk Cars is your free AI car expert. Compare car models, get buying advice, explore specs, maintenance tips, EV reviews, and motorsport insights — available in English, French, Arabic, and Turkish. | مساعد ذكاء اصطناعي للسيارات — مقارنة السيارات، نصائح الشراء، مراجعات السيارات الكهربائية. | Comparez des voitures, conseils d'achat automobile, essais et entretien. | Araba karşılaştırma, satın alma tavsiyesi, EV incelemeleri.",

  /* ─── Keywords (EN + FR + AR + TR) ──────────────────── */
  keywords: [
    // English
    "car AI assistant", "AI car chat", "talk to cars AI", "car comparison tool",
    "best car to buy 2024", "best car to buy 2025", "used car advice", "EV comparison",
    "electric vehicle recommendations", "car specs", "car maintenance tips", "car buying guide",
    "motorsport AI", "automotive AI chatbot", "free car AI", "car expert online",
    "SUV comparison", "sedan vs SUV", "best electric car", "hybrid car guide",
    "car insurance advice", "car loan calculator tips", "test drive tips",
    // French
    "assistant IA voiture", "comparaison de voitures", "chatbot automobile", "conseils achat voiture",
    "meilleure voiture électrique", "avis voiture IA", "entretien voiture", "essai routier IA",
    "voiture hybride conseils", "guide achat voiture neuve", "voitures d'occasion IA",
    // Arabic
    "مساعد ذكاء اصطناعي سيارات", "مقارنة السيارات", "أفضل سيارة للشراء", "نصائح شراء السيارات",
    "مراجعة السيارات الكهربائية", "دردشة السيارات", "خبير سيارات مجاني", "صيانة السيارات",
    "سيارات هايبرد", "أفضل سيارة 2024", "أفضل سيارة 2025", "تقارير السيارات",
    // Turkish
    "araba yapay zeka asistan", "araba karşılaştırma", "en iyi araba tavsiyesi",
    "elektrikli araç karşılaştırma", "araba bakım ipuçları", "araç satın alma rehberi",
    "AI araba sohbet", "otomobil uzmanı", "en iyi elektrikli araba 2024",
    // Brand
    "Talk Cars", "TalkCars AI", "Algorix Agency",
  ],

  /* ─── Authors & Publisher ────────────────────────────── */
  authors: [{ name: "Algorix Agency", url: "https://algorix-agency.com" }],
  creator: "Algorix Agency",
  publisher: "Algorix Agency",

  /* ─── Robots ─────────────────────────────────────────── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ─── hreflang / Alternates ──────────────────────────── */
  alternates: {
    canonical: siteUrl,
    languages: {
      "en":    siteUrl,
      "fr":    `${siteUrl}/fr`,
      "ar":    `${siteUrl}/ar`,
      "tr":    `${siteUrl}/tr`,
      "x-default": siteUrl,
    },
  },

  /* ─── Open Graph ─────────────────────────────────────── */
  openGraph: {
    title: "Talk Cars — Free AI Car Expert Chat",
    description:
      "Compare cars, get buying advice, explore specs & EV reviews — all powered by AI. Available in English, French, Arabic & Turkish.",
    url: siteUrl,
    siteName: "Talk Cars AI",
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR", "ar_SA", "tr_TR"],
    images: [
      {
        url: "/logo1.png",
        width: 1080,
        height: 1080,
        alt: "Talk Cars — AI Car Chat Assistant",
      },
    ],
  },

  /* ─── Twitter / X Card ───────────────────────────────── */
  twitter: {
    card: "summary_large_image",
    title: "Talk Cars — Free AI Car Expert",
    description:
      "Your free AI car expert. Compare models, get advice & explore EVs — in English, French, Arabic & Turkish.",
    images: ["/logo1.png"],
    creator: "@algorixagency",
  },

  /* ─── App-level ──────────────────────────────────────── */
  applicationName: "Talk Cars AI",
  category: "automotive",
  classification: "Automotive / AI Assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        {/* Structured Data — JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Talk Cars AI",
              "url": siteUrl,
              "description": "Free AI-powered car expert for car comparison, buying advice, EV reviews, and maintenance tips.",
              "applicationCategory": "AutomotiveApplication",
              "operatingSystem": "Web Browser",
              "inLanguage": ["en", "fr", "ar", "tr"],
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
              "author": {
                "@type": "Organization",
                "name": "Algorix Agency",
                "url": "https://algorix-agency.com",
                "email": "contact@algorix-agency.com",
              },
            }),
          }}
        />
        {/* hreflang tags for search engine language targeting */}
        <link rel="alternate" hrefLang="en" href={siteUrl} />
        <link rel="alternate" hrefLang="fr" href={`${siteUrl}/fr`} />
        <link rel="alternate" hrefLang="ar" href={`${siteUrl}/ar`} />
        <link rel="alternate" hrefLang="tr" href={`${siteUrl}/tr`} />
        <link rel="alternate" hrefLang="x-default" href={siteUrl} />
      </head>
      <body className="min-h-full font-sans antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}

