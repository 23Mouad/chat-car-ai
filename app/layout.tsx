import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AutoMind — AI Car Chat Assistant by Algorix Agency",
  description:
    "Your AI co-pilot for everything cars. Compare models, get buying advice, explore specs, maintenance tips, EV insights, and motorsport knowledge — powered by AutoMind and built by Algorix Agency.",
  keywords: "car AI assistant, car comparison, EV advice, car buying, AutoMind, Algorix Agency",
  authors: [{ name: "Algorix Agency", url: "mailto:contact@algorix-agency.com" }],
  creator: "Algorix Agency",
  openGraph: {
    title: "AutoMind — AI Car Chat Assistant by Algorix Agency",
    description: "Your AI co-pilot for everything cars. Built by Algorix Agency.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
