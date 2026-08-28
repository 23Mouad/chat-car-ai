"use client";

import { motion } from "framer-motion";

const PHRASES = [
  "Revving up a response…",
  "Checking the specs…",
  "Shifting gears…",
  "Consulting the garage…",
  "Burning rubber for you…",
];

function randomPhrase() {
  return PHRASES[Math.floor(Math.random() * PHRASES.length)];
}

// Animated SVG car with rotating wheels and exhaust puffs
function CarSVG() {
  return (
    <svg width="72" height="34" viewBox="0 0 72 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6C7CFF" />
          <stop offset="100%" stopColor="#C86CFF" />
        </linearGradient>
        <linearGradient id="windowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(200,220,255,0.6)" />
        </linearGradient>
      </defs>

      {/* Car body */}
      <rect x="6" y="13" width="60" height="14" rx="5" fill="url(#bodyGrad)" />

      {/* Car roof / cabin */}
      <path d="M18 13 L24 4 L50 4 L58 13" fill="url(#bodyGrad)" />

      {/* Windows */}
      <rect x="25" y="5" width="10" height="7" rx="2" fill="url(#windowGrad)" />
      <rect x="37" y="5" width="10" height="7" rx="2" fill="url(#windowGrad)" />

      {/* Door line */}
      <line x1="36" y1="13" x2="36" y2="27" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

      {/* Headlight */}
      <rect x="63" y="17" width="5" height="4" rx="1.5" fill="#FFF9C0" opacity="0.95" />
      <rect x="64" y="18" width="3" height="2" rx="1" fill="#FFE566" />

      {/* Tail light */}
      <rect x="4" y="17" width="4" height="4" rx="1.5" fill="#FF6B6B" opacity="0.9" />

      {/* Wheel arches */}
      <circle cx="20" cy="27" r="7" fill="#1a1a2e" />
      <circle cx="52" cy="27" r="7" fill="#1a1a2e" />

      {/* Wheels (animated externally) */}
      <motion.g
        style={{ transformOrigin: "20px 27px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="20" cy="27" r="5" fill="#2d2d4e" />
        <line x1="20" y1="22" x2="20" y2="32" stroke="#8888CC" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="15" y1="27" x2="25" y2="27" stroke="#8888CC" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="27" r="1.5" fill="#6C7CFF" />
      </motion.g>

      <motion.g
        style={{ transformOrigin: "52px 27px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="52" cy="27" r="5" fill="#2d2d4e" />
        <line x1="52" y1="22" x2="52" y2="32" stroke="#8888CC" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="47" y1="27" x2="57" y2="27" stroke="#8888CC" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="52" cy="27" r="1.5" fill="#C86CFF" />
      </motion.g>

      {/* Undercarriage / ground clearance line */}
      <rect x="8" y="26" width="56" height="2" rx="1" fill="rgba(255,255,255,0.08)" />
    </svg>
  );
}

// Road dashes
function RoadDashes() {
  return (
    <div className="absolute bottom-3 left-0 right-0 flex gap-3 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="h-[2px] w-8 flex-shrink-0 rounded-full bg-[#9B6CFF]/25"
          animate={{ x: [0, -48] }}
          transition={{
            duration: 0.45,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.055,
          }}
        />
      ))}
    </div>
  );
}

// Exhaust puff
function ExhaustPuff({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute bottom-4 rounded-full bg-[#9B6CFF]/20"
      style={{ left: "4px" }}
      initial={{ width: 6, height: 6, x: 0, opacity: 0.7 }}
      animate={{ width: 16, height: 16, x: -20, opacity: 0, y: -4 }}
      transition={{
        duration: 0.9,
        repeat: Infinity,
        ease: "easeOut",
        delay,
      }}
    />
  );
}

export function TypingIndicator() {
  const phrase = randomPhrase();

  return (
    <motion.div
      className="flex gap-2.5 items-end"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.25 }}
    >
      {/* AI avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#6C7CFF] to-[#C86CFF] flex items-center justify-center shadow-md mb-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
          <rect x="9" y="11" width="14" height="10" rx="2" />
          <circle cx="12" cy="20" r="1" />
          <circle cx="20" cy="20" r="1" />
        </svg>
      </div>

      {/* Bubble with car animation */}
      <div className="relative bg-white/85 backdrop-blur-sm border border-white/60 rounded-[20px] rounded-bl-sm shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden"
        style={{ width: 220, height: 68 }}>

        {/* Road */}
        <div className="absolute bottom-3 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D0D0EE]/60 to-transparent" />
        <RoadDashes />

        {/* Exhaust puffs */}
        <ExhaustPuff delay={0} />
        <ExhaustPuff delay={0.3} />
        <ExhaustPuff delay={0.6} />

        {/* Animated car driving across */}
        <motion.div
          className="absolute bottom-3"
          animate={{ x: ["-10%", "115%"] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            repeatDelay: 0.1,
          }}
        >
          <CarSVG />
        </motion.div>

        {/* Label */}
        <div className="absolute top-2 left-0 right-0 flex justify-center">
          <motion.span
            className="text-[10px] font-semibold text-[#9B6CFF] tracking-wide"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            {phrase}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
