"use client";

import { motion } from "framer-motion";

interface GradientOrbProps {
  color: string;
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  opacity?: number;
  delay?: number;
}

export function GradientOrb({
  color,
  size,
  top,
  left,
  right,
  bottom,
  opacity = 0.5,
  delay = 0,
}: GradientOrbProps) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        top,
        left,
        right,
        bottom,
        opacity,
        filter: "blur(80px)",
      }}
      animate={{
        scale: [1, 1.08, 0.96, 1],
        x: [0, 18, -10, 0],
        y: [0, -12, 8, 0],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
        repeatType: "loop",
      }}
    />
  );
}
