"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { Car, Zap, MessageCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background orbs */}
      <GradientOrb color="radial-gradient(circle, #C9B6FF, transparent)" size={600} top="-100px" left="-150px" opacity={0.55} delay={0} />
      <GradientOrb color="radial-gradient(circle, #A6C8FF, transparent)" size={500} top="30%" right="-100px" opacity={0.45} delay={3} />
      <GradientOrb color="radial-gradient(circle, #FFC2E2, transparent)" size={400} bottom="10%" left="20%" opacity={0.4} delay={6} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C7CFF] to-[#C86CFF] flex items-center justify-center shadow-lg">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#14142B] tracking-tight">AutoMind</span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-5">
          <Link href="/chat" className="text-sm font-medium text-[#5B5B70] hover:text-[#6C7CFF] transition-colors">Chat</Link>
          <Link href="#features" className="text-sm font-medium text-[#5B5B70] hover:text-[#6C7CFF] transition-colors">Features</Link>
          <Link href="#about" className="text-sm font-medium text-[#5B5B70] hover:text-[#6C7CFF] transition-colors">About</Link>
          <Link
            href="/chat"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#6C7CFF] to-[#C86CFF] text-white text-sm font-semibold shadow-[0_4px_16px_rgba(108,124,255,0.35)] hover:shadow-[0_6px_22px_rgba(108,124,255,0.5)] transition-all duration-200"
          >
            Start Chatting
          </Link>
        </div>
      </nav>

      {/* Algorix badge — top right corner */}
      <motion.a
        href="#about"
        className="absolute top-5 right-6 md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Image src="/algorix-logo.png" alt="Algorix" width={16} height={16} className="rounded" />
        <span className="text-[10px] font-bold bg-gradient-to-r from-[#2563EB] to-[#38BDF8] bg-clip-text text-transparent">by ALGORIX</span>
      </motion.a>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 px-6 md:px-12 py-12">
        {/* Text */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-[#9B6CFF]/25 text-[#9B6CFF] text-xs font-semibold mb-6 shadow-sm">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Car Expert
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#14142B] leading-[1.1] tracking-tight mb-5">
              Your AI co-pilot for{" "}
              <span className="bg-gradient-to-r from-[#6C7CFF] via-[#9B6CFF] to-[#C86CFF] bg-clip-text text-transparent">
                everything cars.
              </span>
            </h1>
            <p className="text-lg text-[#5B5B70] leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              Ask about models, specs, buying advice, maintenance, EVs, or motorsport. AutoMind knows cars inside out — powered by next-gen AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/chat"
                id="hero-cta"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#6C7CFF] via-[#9B6CFF] to-[#C86CFF] text-white font-semibold text-base shadow-[0_6px_24px_rgba(108,124,255,0.4)] hover:shadow-[0_8px_30px_rgba(108,124,255,0.55)] hover:scale-[1.02] transition-all duration-200"
              >
                <MessageCircle className="w-4.5 h-4.5" />
                Start chatting
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/60 text-[#5B5B70] font-semibold text-base hover:bg-white/80 hover:text-[#6C7CFF] transition-all duration-200"
              >
                See features
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Phone mockup */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <div className="relative w-[280px] h-[560px] rounded-[40px] bg-gradient-to-br from-[#6C7CFF]/10 to-[#C86CFF]/10 border-2 border-white/60 backdrop-blur-sm shadow-[0_32px_80px_rgba(108,124,255,0.2)] overflow-hidden">
            {/* Phone notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-[#14142B]/8 z-20" />

            {/* Chat preview */}
            <div className="absolute inset-0 p-4 pt-14 flex flex-col gap-3 bg-gradient-to-b from-[#F5F6FC] to-white/80">
              <div className="flex gap-2 items-end">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6C7CFF] to-[#C86CFF] flex items-center justify-center">
                  <Car className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white/90 rounded-[16px] rounded-bl-sm px-3 py-2 text-[11px] text-[#14142B] max-w-[200px] shadow-sm border border-white/60">
                  Hey! Ready to talk cars? 🏎️ What are you curious about?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-gradient-to-br from-[#6C7CFF] to-[#C86CFF] rounded-[16px] rounded-br-sm px-3 py-2 text-[11px] text-white max-w-[160px] shadow-md">
                  Compare Tesla Model 3 vs BMW i4
                </div>
              </div>
              <div className="flex gap-2 items-end">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6C7CFF] to-[#C86CFF] flex items-center justify-center">
                  <Car className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white/90 rounded-[16px] rounded-bl-sm px-3 py-2 text-[11px] text-[#14142B] max-w-[200px] shadow-sm border border-white/60">
                  Great comparison! The i4 wins on driving dynamics while the Model 3 leads on tech...
                </div>
              </div>
              {/* Typing indicator preview */}
              <div className="flex gap-2 items-center">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6C7CFF] to-[#C86CFF] flex items-center justify-center">
                  <Car className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white/90 rounded-[16px] rounded-bl-sm px-3 py-2 shadow-sm border border-white/60 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9B6CFF] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9B6CFF] animate-bounce" style={{ animationDelay: "160ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9B6CFF] animate-bounce" style={{ animationDelay: "320ms" }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
