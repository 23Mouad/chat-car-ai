"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { type Lang, type Translations, LANGS, translations } from "@/lib/i18n";

interface LangContextValue {
  lang: Lang;
  t: Translations;
  dir: "ltr" | "rtl";
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  t: translations.en,
  dir: "ltr",
  setLang: () => {},
});

/** Detect best matching lang from browser preferences */
function detectBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const preferred = navigator.languages ?? [navigator.language ?? "en"];
  for (const loc of preferred) {
    const code = loc.split("-")[0].toLowerCase();
    if (code === "ar") return "ar";
    if (code === "fr") return "fr";
    if (code === "tr") return "tr";
    if (code === "en") return "en";
  }
  return "en";
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // On mount: read from localStorage or detect from browser
  useEffect(() => {
    const stored = localStorage.getItem("tc-lang") as Lang | null;
    const validCodes = LANGS.map((l) => l.code);
    const chosen =
      stored && validCodes.includes(stored) ? stored : detectBrowserLang();
    setLangState(chosen);
  }, []);

  // Sync html[lang] and html[dir] attributes when language changes
  useEffect(() => {
    const info = LANGS.find((l) => l.code === lang)!;
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", info.dir);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("tc-lang", l);
  }, []);

  const t = translations[lang];
  const dir = LANGS.find((l) => l.code === lang)!.dir;

  return (
    <LangContext.Provider value={{ lang, t, dir, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
