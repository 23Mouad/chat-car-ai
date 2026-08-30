"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff } from "lucide-react";
import { useLang } from "@/lib/langContext";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

// BCP-47 locale codes for SpeechRecognition
const LANG_TO_LOCALE: Record<string, string> = {
  en: "en-US",
  fr: "fr-FR",
  ar: "ar-SA",
  tr: "tr-TR",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SR = any;

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const { lang } = useLang();
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [interimText, setInterimText] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SR>(null);
  // Tracks whether the current session was stopped intentionally by the user
  const stoppedByUserRef = useRef(false);

  // ── Check browser support once on mount ───────────────────────────────────
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    setSpeechSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  // ── Auto-resize textarea whenever `value` changes (covers voice input too) ─
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    setInterimText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Speech-to-Text ────────────────────────────────────────────────────────
  // Strategy: continuous: false — one utterance at a time, restart after each.
  // This is the approach used by WhatsApp/Siri/Google and avoids the
  // duplication bug that happens with continuous:true + interimResults:true.

  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SRClass = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SRClass) return;

    stoppedByUserRef.current = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition: SR = new SRClass();
    recognitionRef.current = recognition;

    recognition.lang = LANG_TO_LOCALE[lang] ?? "en-US";
    recognition.continuous = false;     // ← one phrase at a time (no duplicates)
    recognition.interimResults = true;  // show partial words while speaking

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      let interim = "";
      let finalText = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalText) {
        // Append the recognised phrase to whatever is already typed
        setValue((prev) => {
          const trimmedPrev = prev.trimEnd();
          const space = trimmedPrev.length > 0 ? " " : "";
          return trimmedPrev + space + finalText.trim();
        });
        setInterimText("");
      } else {
        setInterimText(interim);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "aborted" || event.error === "no-speech") return;
      console.warn("Speech recognition error:", event.error);
      setIsListening(false);
      setInterimText("");
    };

    recognition.onend = () => {
      setInterimText("");
      if (!stoppedByUserRef.current) {
        // Auto-restart so the mic stays active until the user taps stop
        try {
          recognition.start();
        } catch {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognition.start();
  }, [lang]);

  const stopListening = useCallback(() => {
    stoppedByUserRef.current = true;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setIsListening(false);
    setInterimText("");
  }, []);

  const toggleMic = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  // Stop and restart recognition when language changes so new lang takes effect
  useEffect(() => {
    if (!isListening) return;
    stopListening();
    // Brief delay to let the old session fully abort before starting fresh
    const t = setTimeout(() => startListening(), 200);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stoppedByUserRef.current = true;
      recognitionRef.current?.abort();
    };
  }, []);

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="flex items-end gap-2">
      {/* ── Mic button ──────────────────────────────────────── */}
      {speechSupported && (
        <motion.button
          onClick={toggleMic}
          disabled={disabled}
          whileTap={{ scale: 0.88 }}
          className={`relative flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 ${
            isListening
              ? "bg-gradient-to-br from-[#FF5F5F] to-[#C86CFF] text-white shadow-[0_4px_16px_rgba(255,95,95,0.4)]"
              : "bg-white/70 backdrop-blur-sm border border-white/60 text-[#9B6CFF] hover:bg-white/90"
          }`}
          aria-label={isListening ? "Stop recording" : "Start voice input"}
        >
          {isListening && (
            <motion.span
              className="absolute inset-0 rounded-full bg-[#FF5F5F]/40"
              animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div key="mic-off" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MicOff className="w-4.5 h-4.5" />
              </motion.div>
            ) : (
              <motion.div key="mic-on" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Mic className="w-4.5 h-4.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}

      {/* ── Text input ──────────────────────────────────────── */}
      <div
        className={`flex-1 flex items-end gap-2 bg-white/70 backdrop-blur-sm border rounded-[22px] px-4 py-2.5 shadow-sm transition-all duration-200 ${
          isListening
            ? "border-[#FF5F5F]/50 shadow-[0_0_0_3px_rgba(255,95,95,0.1)]"
            : "border-white/60 focus-within:border-[#9B6CFF]/50 focus-within:shadow-[0_0_0_3px_rgba(155,108,255,0.1)]"
        }`}
      >
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "🎙️ Listening…" : "Ask me anything about cars…"}
            disabled={disabled}
            rows={1}
            className="w-full bg-transparent text-[#14142B] placeholder-[#A0A0B8] text-sm resize-none outline-none leading-relaxed max-h-[160px] disabled:opacity-60"
            aria-label="Chat message input"
            style={{ minHeight: "24px", overflowY: "auto" }}
          />
          {/* Interim partial transcript */}
          {interimText && (
            <p className="text-xs text-[#9B9BB8] mt-1 italic leading-snug">
              {interimText}
            </p>
          )}
        </div>
      </div>

      {/* ── Send button ─────────────────────────────────────── */}
      <motion.button
        onClick={handleSend}
        disabled={!canSend}
        className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
          canSend
            ? "bg-gradient-to-br from-[#6C7CFF] via-[#9B6CFF] to-[#C86CFF] text-white shadow-[0_4px_16px_rgba(108,124,255,0.4)] hover:shadow-[0_6px_20px_rgba(108,124,255,0.5)]"
            : "bg-[#E8E8F0] text-[#B0B0C8] cursor-not-allowed"
        }`}
        whileTap={canSend ? { scale: 0.9 } : {}}
        aria-label="Send message"
      >
        <AnimatePresence mode="wait">
          {disabled ? (
            <motion.div key="loading" className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
          ) : (
            <motion.div key="send" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <Send className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
