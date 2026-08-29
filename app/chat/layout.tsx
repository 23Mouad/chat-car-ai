// Server component — exports Metadata for the /chat route
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat | Talk Cars AI — Ask Your Car Question",
  description:
    "Chat live with the Talk Cars AI car expert. Ask about car specs, comparisons, maintenance, EVs, and more — in English, French, Arabic, or Turkish. | دردش مع مساعد السيارات الذكي. | Chattez avec l'expert auto IA. | Araba uzmanı AI ile sohbet edin.",
  robots: { index: false, follow: false }, // chat sessions are private
  alternates: {
    canonical: "https://talkcars.ai/chat",
  },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
