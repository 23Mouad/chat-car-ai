"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
}

export function GlassCard({ children, className = "", animate = false, delay = 0 }: GlassCardProps) {
  const base = `bg-white/65 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(108,124,255,0.08)] rounded-3xl ${className}`;

  if (animate) {
    return (
      <motion.div
        className={base}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={base}>{children}</div>;
}
