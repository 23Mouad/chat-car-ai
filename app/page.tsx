import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { BelowFold } from "@/components/landing/BelowFold";

export const metadata: Metadata = {
  title: "Talk Cars — Free AI Car Chat | مساعد السيارات الذكي | Assistant Auto IA | Araba AI",
  description:
    "Talk Cars is a free AI car expert. Ask anything about cars — compare models, get buying advice, EV reviews, maintenance tips — in English, French, Arabic or Turkish. | مساعد ذكاء اصطناعي مجاني للسيارات. | Votre expert automobile IA gratuit. | Ücretsiz yapay zeka araba uzmanı.",
  alternates: {
    canonical: "https://talkcars.ai",
    languages: {
      "en": "https://talkcars.ai",
      "fr": "https://talkcars.ai/fr",
      "ar": "https://talkcars.ai/ar",
      "tr": "https://talkcars.ai/tr",
    },
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F5F6FC] overflow-x-hidden">
      {/* Hero: above-fold — in critical bundle, server-rendered */}
      <Hero />
      {/* Below-fold: lazy-loaded client bundle, split into separate JS chunks */}
      <BelowFold />
    </main>
  );
}
