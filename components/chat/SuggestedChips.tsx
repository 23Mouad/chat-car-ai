"use client";

import { motion } from "framer-motion";

const CHIPS = [
  { emoji: "🏎️", label: "Sports cars" },
  { emoji: "🔋", label: "Best EVs 2025" },
  { emoji: "🔧", label: "Maintenance tips" },
  { emoji: "💰", label: "Budget under $20k" },
  { emoji: "🚙", label: "Best SUVs" },
  { emoji: "⚡", label: "Tesla vs rivals" },
  { emoji: "🏁", label: "F1 & Motorsport" },
  { emoji: "🔍", label: "Car comparisons" },
];

interface SuggestedChipsProps {
  onSelect: (text: string) => void;
}

export function SuggestedChips({ onSelect }: SuggestedChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CHIPS.map((chip, i) => (
        <motion.button
          key={chip.label}
          onClick={() => onSelect(`${chip.emoji} ${chip.label}`)}
          className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-white/60 text-[#5B5B70] text-xs font-medium shadow-sm hover:bg-white/90 hover:border-[#9B6CFF]/40 hover:text-[#6C7CFF] transition-all duration-200 cursor-pointer min-h-[44px]"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Ask about ${chip.label}`}
        >
          <span>{chip.emoji}</span>
          <span>{chip.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
