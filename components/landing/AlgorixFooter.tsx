"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ExternalLink, Car, Github, Globe } from "lucide-react";

export function AlgorixFooter() {
  return (
    <footer id="about" className="relative mt-8 overflow-hidden">
      {/* Dark gradient band */}
      <div className="bg-gradient-to-br from-[#0D0D1F] via-[#111133] to-[#0a0a2a] text-white">
        {/* Top wave divider */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-14 fill-[#F5F6FC]">
            <path d="M0,60 C360,0 1080,60 1440,0 L1440,0 L0,0 Z" />
          </svg>
        </div>

        <div className="relative pt-20 pb-10 px-6 md:px-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

            {/* Column 1 — AutoMind product */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C7CFF] to-[#C86CFF] flex items-center justify-center shadow-lg">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">AutoMind</span>
              </div>
              <p className="text-sm text-white/55 leading-relaxed mb-4 max-w-[220px]">
                Your AI co-pilot for everything cars — powered by next-generation language models.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9B6CFF] hover:text-[#C86CFF] transition-colors"
              >
                Launch Chat <ExternalLink className="w-3 h-3" />
              </Link>
            </motion.div>

            {/* Column 2 — Made by Algorix */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/35 mb-4">
                Built & Powered by
              </p>

              {/* Algorix logo */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                  <Image
                    src="/algorix-logo.png"
                    alt="Algorix Agency"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-[#2563EB] to-[#38BDF8] bg-clip-text text-transparent">
                    ALGORIX
                  </p>
                  <p className="text-[11px] text-white/40 -mt-0.5">Agency®</p>
                </div>
              </div>

              <p className="text-xs text-white/50 leading-relaxed max-w-[230px]">
                Votre partenaire technologique de confiance pour transformer vos idées en solutions digitales innovantes et performantes.
              </p>
            </motion.div>

            {/* Column 3 — Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/35 mb-4">
                Contact Algorix
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="mailto:contact@algorix-agency.com"
                  className="flex items-center gap-2.5 text-sm text-white/65 hover:text-white transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#6C7CFF]/20 group-hover:border-[#6C7CFF]/30 transition-all">
                    <Mail className="w-3.5 h-3.5 text-[#6C7CFF]" />
                  </div>
                  <span>contact@algorix-agency.com</span>
                </a>

                <a
                  href="tel:0696566905"
                  className="flex items-center gap-2.5 text-sm text-white/65 hover:text-white transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#9B6CFF]/20 group-hover:border-[#9B6CFF]/30 transition-all">
                    <Phone className="w-3.5 h-3.5 text-[#9B6CFF]" />
                  </div>
                  <span>0696 566 905</span>
                </a>

                <div className="flex items-center gap-2.5 text-sm text-white/65">
                  <div className="w-7 h-7 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[#C86CFF]" />
                  </div>
                  <span>Annaba, Algérie</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-6" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
            <p>
              © {new Date().getFullYear()}{" "}
              <span className="text-white/50 font-medium">Algorix Agency</span>
              {" "}· All rights reserved.
            </p>
            <div className="flex items-center gap-1.5">
              <span>AutoMind is a product of</span>
              <span className="font-bold bg-gradient-to-r from-[#2563EB] to-[#38BDF8] bg-clip-text text-transparent">
                Algorix Agency
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
