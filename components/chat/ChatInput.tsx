"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
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

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="flex items-end gap-2">
      {/* Mic button (visual only) */}
      <button
        className="flex-shrink-0 w-11 h-11 rounded-full bg-white/70 backdrop-blur-sm border border-white/60 flex items-center justify-center text-[#9B6CFF] shadow-sm hover:bg-white/90 transition-all duration-200"
        aria-label="Voice input (coming soon)"
        disabled={disabled}
      >
        <Mic className="w-4.5 h-4.5" />
      </button>

      {/* Input pill */}
      <div className="flex-1 flex items-end gap-2 bg-white/70 backdrop-blur-sm border border-white/60 rounded-[22px] px-4 py-2.5 shadow-sm focus-within:border-[#9B6CFF]/50 focus-within:shadow-[0_0_0_3px_rgba(155,108,255,0.1)] transition-all duration-200">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask me anything about cars…"
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-[#14142B] placeholder-[#A0A0B8] text-sm resize-none outline-none leading-relaxed max-h-[120px] disabled:opacity-60"
          aria-label="Chat message input"
          style={{ minHeight: "24px" }}
        />
      </div>

      {/* Send button */}
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
