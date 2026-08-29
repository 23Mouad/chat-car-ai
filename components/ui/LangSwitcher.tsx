"use client";

import { LANGS } from "@/lib/i18n";
import { useLang } from "@/lib/langContext";
import { motion } from "framer-motion";
import { useState } from "react";

export function LangSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  const current = LANGS.find((l) => l.code === lang)!;

  /* ── Compact dropdown (for chat header / mobile) ─── */
  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white/70 border border-white/60 shadow-sm text-[#5B5B70] hover:bg-white hover:text-[#6C7CFF] transition-all text-xs font-semibold backdrop-blur-sm"
          aria-label="Switch language"
        >
          <span className="text-sm leading-none">{current.flag}</span>
          <span>{current.label}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className={`transition-transform ${open ? "rotate-180" : ""}`}>
            <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
        </button>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-1.5 right-0 z-50 bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden min-w-[100px]"
          >
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors hover:bg-[#6C7CFF]/8 ${lang === l.code ? "text-[#6C7CFF] bg-[#6C7CFF]/6 font-semibold" : "text-[#5B5B70]"}`}
              >
                <span className="text-sm">{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    );
  }

  /* ── Full pill switcher (for navbar / desktop) ────── */
  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-white/50 border border-white/60 backdrop-blur-sm shadow-sm">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          title={l.label}
          className={`relative flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 ${
            lang === l.code
              ? "bg-gradient-to-r from-[#6C7CFF] to-[#9B6CFF] text-white shadow-md"
              : "text-[#5B5B70] hover:text-[#6C7CFF] hover:bg-white/70"
          }`}
        >
          <span className="text-sm leading-none">{l.flag}</span>
          <span className="hidden sm:inline">{l.label}</span>
        </button>
      ))}
    </div>
  );
}
