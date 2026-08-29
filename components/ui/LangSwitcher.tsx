"use client";

import { LANGS, type Lang } from "@/lib/i18n";
import { useLang } from "@/lib/langContext";

export function LangSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();

  return (
    <div className="relative inline-block">
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className={`appearance-none bg-white/70 border border-white/60 backdrop-blur-sm text-[#5B5B70] font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-[#6C7CFF]/50 shadow-sm transition-all hover:bg-white hover:text-[#6C7CFF] cursor-pointer ${
          compact ? "text-xs pl-2.5 pr-6 py-1.5" : "text-sm pl-3 pr-8 py-1.5"
        }`}
        aria-label="Switch language"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code} className="text-black bg-white">
            {l.flag} {l.label}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#5B5B70]">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path
            d="M1 3l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
