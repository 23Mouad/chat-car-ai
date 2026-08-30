"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff } from "lucide-react";
import { useLang } from "@/lib/langContext";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

// Map our app language codes to BCP-47 locale codes for SpeechRecognition
const LANG_TO_LOCALE: Record<string, string> = {
  en: "en-US",
  fr: "fr-FR",
  ar: "ar-SA",
  tr: "tr-TR",
};

// Browser SpeechRecognition — not yet in all TS lib versions, so we cast
type AnySpeechRecognition = typeof window extends { SpeechRecognition: infer T } ? T : never;
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

  // Check browser support on mount
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    setSpeechSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    setInterimText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  /* ── Speech-to-Text ───────────────────────────────────── */
  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SRClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SRClass) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition: SR = new SRClass();
    recognitionRef.current = recognition;

    recognition.lang = LANG_TO_LOCALE[lang] ?? "en-US";
    recognition.continuous = true;      // keep listening until we stop it
    recognition.interimResults = true;  // show partial results while speaking

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      let interim = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalText) {
        setValue((prev) => {
          const joined = prev + (prev && !prev.endsWith(" ") ? " " : "") + finalText;
          return joined;
        });
        setInterimText("");
      } else {
        setInterimText(interim);
      }
    };

    recognition.onerror = (event: any) => {
      // "aborted" fires when we call stop() manually — ignore it
      if (event.error !== "aborted") {
        console.warn("Speech recognition error:", event.error);
      }
      setIsListening(false);
      setInterimText("");
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setInterimText("");
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Stop recognition when the component unmounts or the language changes
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, [lang]);

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="flex items-end gap-2">
      {/* ── Mic button ──────────────────────────────────── */}
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
          {/* Pulsing ring while listening */}
          {isListening && (
            <motion.span
              className="absolute inset-0 rounded-full bg-[#FF5F5F]/40"
              animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="mic-off"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MicOff className="w-4.5 h-4.5" />
              </motion.div>
            ) : (
              <motion.div
                key="mic-on"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Mic className="w-4.5 h-4.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}

      {/* ── Text input ──────────────────────────────────── */}
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
            onInput={handleInput}
            placeholder={isListening ? "🎙️ Listening…" : "Ask me anything about cars…"}
            disabled={disabled}
            rows={1}
            className="w-full bg-transparent text-[#14142B] placeholder-[#A0A0B8] text-sm resize-none outline-none leading-relaxed max-h-[120px] disabled:opacity-60"
            aria-label="Chat message input"
            style={{ minHeight: "24px" }}
          />
          {/* Interim (partial) transcript shown in grey under text */}
          {interimText && (
            <p className="text-xs text-[#9B9BB8] mt-1 italic leading-snug">
              {interimText}
            </p>
          )}
        </div>
      </div>

      {/* ── Send button ─────────────────────────────────── */}
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
            <motion.div
              key="loading"
              className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
            />
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
