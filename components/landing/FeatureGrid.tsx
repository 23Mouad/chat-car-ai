"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { GitCompare, Navigation, Wrench, TrendingUp, Zap, Trophy } from "lucide-react";
import { useLang } from "@/lib/langContext";

const ICONS = [GitCompare, Navigation, Wrench, Zap, TrendingUp, Trophy];
const GRADIENTS = [
  "from-[#6C7CFF] to-[#9B6CFF]",
  "from-[#9B6CFF] to-[#C86CFF]",
  "from-[#C86CFF] to-[#FF6CB0]",
  "from-[#6C7CFF] to-[#42A5FF]",
  "from-[#42A5FF] to-[#9BDDE0]",
  "from-[#9FE7DD] to-[#6C7CFF]",
];

export function FeatureGrid() {
  const { t } = useLang();
  const f = t.features;

  return (
    <section id="features" className="relative px-6 md:px-12 pb-24 pt-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#14142B] mb-3 tracking-tight">
            {f.heading}
          </h2>
          <p className="text-[#5B5B70] text-base max-w-lg mx-auto">
            {f.subheading}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {f.items.map((feature, i) => {
            const Icon = ICONS[i];
            return (
              <GlassCard key={i} animate delay={i * 0.08} className="p-6 group hover:shadow-[0_12px_40px_rgba(108,124,255,0.15)] hover:-translate-y-1 transition-all duration-300">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${GRADIENTS[i]} flex items-center justify-center mb-4 shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#14142B] text-base mb-2">{feature.title}</h3>
                <p className="text-[#5B5B70] text-sm leading-relaxed">{feature.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
