"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { History, Plus } from "lucide-react";
import Image from "next/image";
import { useChatStore } from "@/lib/store";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ChatInput } from "@/components/chat/ChatInput";
import { SuggestedChips } from "@/components/chat/SuggestedChips";
import { ProfileProgress } from "@/components/chat/ProfileProgress";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { LangSwitcher } from "@/components/ui/LangSwitcher";
import { useLang } from "@/lib/langContext";
import type { ChatMessage, UserProfile } from "@/types/chat";

/* ─── Helpers ─────────────────────────────────────────────── */

/** Split rawContent on <!--profile: and return [visibleText, rawTagAndAfter] */
function splitOnProfileTag(text: string): [string, string] {
  const idx = text.indexOf("<!--profile:");
  if (idx === -1) return [text, ""];
  return [text.slice(0, idx).trim(), text.slice(idx)];
}

function parseProfileUpdate(text: string): Partial<UserProfile> {
  const match = text.match(/<!--profile:\s*(\{.*?\})/s);
  if (!match) return {};
  try { return JSON.parse(match[1]) as Partial<UserProfile>; }
  catch { return {}; }
}

/**
 * Split a completed AI response (already clean, no profile tag) into bubbles.
 */
function splitIntoMessages(rawContent: string, baseId: string): ChatMessage[] {
  const parts = rawContent
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 10);

  if (parts.length <= 1) {
    return [{ id: baseId, role: "assistant", content: rawContent, timestamp: Date.now() }];
  }

  const now = Date.now();
  return parts.map((part, i) => ({
    id: i === 0 ? baseId : `${baseId}-${i}`,
    role: "assistant" as const,
    content: part,
    timestamp: now + i * 80,
  }));
}

/* ─── Online dot ──────────────────────────────────────────── */
function OnlineDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
    </span>
  );
}

/* ─── Main component ──────────────────────────────────────── */
export default function ChatPage() {
  const {
    conversations, activeId, isStreaming,
    getActive, newConversation, switchConversation,
    addMessage, updateLastMessage, replaceLastMessages,
    setStreaming, updateProfile,
  } = useChatStore();

  const { t } = useLang();
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // Hydrate zustand from localStorage once
  useEffect(() => {
    if (!isInitialized.current) {
      useChatStore.persist.rehydrate();
      isInitialized.current = true;
      // Ensure there is always an active conversation
      setTimeout(() => {
        const store = useChatStore.getState();
        if (!store.activeId || store.conversations.length === 0) {
          store.newConversation();
        }
      }, 0);
    }
  }, []);

  // Auto-scroll when messages or streaming changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, isStreaming, conversations]);

  const active = getActive();
  const messages: ChatMessage[] = active?.messages ?? [];
  const profile: Partial<UserProfile> = active?.profile ?? {};

  const handleNewChat = useCallback(() => {
    newConversation();
  }, [newConversation]);

  const handleSend = useCallback(
    async (text: string) => {
      if (isStreaming) return;
      setError(null);

      // Ensure active conversation
      let convId = activeId;
      if (!convId) { convId = newConversation(); }

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: Date.now(),
      };
      addMessage(userMsg);

      // Empty AI placeholder (shows typing indicator)
      const aiMsgId = crypto.randomUUID();
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };
      addMessage(aiMsg);
      setStreaming(true);

      // Re-read messages fresh (after addMessage) — exclude the empty AI placeholder
      const sendMessages = [...messages, userMsg]
        .filter((m) => m.content.trim() !== "");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: sendMessages.map((m) => ({ role: m.role, content: m.content })),
            profile,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullContent += decoder.decode(value, { stream: true });
          // Always strip everything from <!--profile: onwards before storing
          const [visibleContent] = splitOnProfileTag(fullContent);
          updateLastMessage(visibleContent);
        }

        // Parse profile from the raw fullContent (the part after <!--profile:)
        const [cleanContent, tagPart] = splitOnProfileTag(fullContent);
        if (tagPart) {
          const profileUpdates = parseProfileUpdate(tagPart);
          if (Object.keys(profileUpdates).length > 0) updateProfile(profileUpdates);
        }

        // Split response into multiple bubbles (already clean)
        const split = splitIntoMessages(cleanContent, aiMsgId);
        if (split.length > 1) {
          replaceLastMessages(split);
        }

      } catch (err) {
        console.error(err);
        setError("Connection lost. Please try again.");
        updateLastMessage("Oops, hit a speed bump! 🚧 Please try again.");
      } finally {
        setStreaming(false);
      }
    },
    [
      activeId, isStreaming, profile,
      addMessage, updateLastMessage, replaceLastMessages,
      setStreaming, updateProfile, newConversation,
    ]
  );

  const showEmptyState = messages.length === 0;
  const showTypingIndicator = isStreaming && (messages.length === 0 || messages[messages.length - 1]?.content === "");

  return (
    <div className="relative h-dvh bg-[#F5F6FC] flex items-stretch justify-center overflow-hidden">
      {/* Background orbs */}
      <div className="orb-bg">
        <GradientOrb color="radial-gradient(circle, #C9B6FF, transparent)" size={520} top="-80px" left="-130px" opacity={0.45} delay={0} />
        <GradientOrb color="radial-gradient(circle, #A6C8FF, transparent)" size={420} bottom="8%" right="-90px" opacity={0.4} delay={4} />
        <GradientOrb color="radial-gradient(circle, #FFC2E2, transparent)" size={360} top="35%" left="-70px" opacity={0.3} delay={8} />
      </div>

      {/* Chat history drawer */}
      <ChatHistory
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onNew={handleNewChat}
      />

      {/* Chat card */}
      <div className="relative z-10 w-full max-w-[540px] flex flex-col h-dvh">
        <div className="flex-1 flex flex-col md:my-5 md:rounded-[32px] md:overflow-hidden md:shadow-[0_28px_90px_rgba(108,124,255,0.18)] glass">

          {/* ── Header ─────────────────────────────── */}
          <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b border-white/50 bg-white/60 backdrop-blur-xl flex-shrink-0">
            {/* Left: History + New */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setHistoryOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#5B5B70] hover:bg-white/70 hover:text-[#6C7CFF] transition-all duration-150"
                aria-label={t.chat.history}
              >
                <History className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={handleNewChat}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#5B5B70] hover:bg-white/70 hover:text-[#6C7CFF] transition-all duration-150"
                aria-label={t.chat.newChat}
              >
                <Plus className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Center: Brand */}
            <Link href="/" className="flex flex-col items-center group">
              <Image
                src="/logoCont.png"
                alt="Talk Cars"
                width={110}
                height={32}
                className="h-8 w-auto object-contain"
                priority
              />
              <div className="flex items-center gap-1.5 mt-0.5">
                <OnlineDot />
                <span className="text-[11px] text-[#7B7B90]">{t.chat.online}</span>
              </div>
            </Link>

            {/* Right: Lang switcher + Profile */}
            <div className="flex items-center justify-end gap-2 w-[88px]">
              <LangSwitcher compact />
              <ProfileProgress profile={profile} />
            </div>
          </header>

          {/* ── Messages ───────────────────────────── */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-5 flex flex-col gap-4" id="message-list">
            {showEmptyState ? (
              !profile.language ? (
                <motion.div
                  className="flex-1 flex flex-col items-center justify-center py-10 gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-[#14142B] mb-2">{t.langPicker.title}</h2>
                    <p className="text-[#5B5B70] text-sm">{t.langPicker.subtitle}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 w-full max-w-[280px]">
                    <button
                      onClick={() => updateProfile({ language: "English" })}
                      className="group flex flex-col items-center justify-center aspect-square bg-white rounded-3xl shadow-[0_8px_24px_rgba(108,124,255,0.12)] hover:shadow-[0_16px_32px_rgba(108,124,255,0.2)] transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#4A90E2]/20"
                    >
                      <span className="text-5xl font-bold bg-gradient-to-br from-[#4A90E2] to-[#2C5282] text-transparent bg-clip-text mb-2 transition-transform group-hover:scale-110">E</span>
                      <span className="text-sm font-medium text-[#5B5B70]">English</span>
                    </button>

                    <button
                      onClick={() => updateProfile({ language: "French" })}
                      className="group flex flex-col items-center justify-center aspect-square bg-white rounded-3xl shadow-[0_8px_24px_rgba(255,108,108,0.12)] hover:shadow-[0_16px_32px_rgba(255,108,108,0.2)] transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#E24A4A]/20"
                    >
                      <span className="text-5xl font-bold bg-gradient-to-br from-[#E24A4A] to-[#822C2C] text-transparent bg-clip-text mb-2 transition-transform group-hover:scale-110">F</span>
                      <span className="text-sm font-medium text-[#5B5B70]">Français</span>
                    </button>

                    <button
                      onClick={() => updateProfile({ language: "Arabic" })}
                      className="group flex flex-col items-center justify-center aspect-square bg-white rounded-3xl shadow-[0_8px_24px_rgba(46,204,113,0.12)] hover:shadow-[0_16px_32px_rgba(46,204,113,0.2)] transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#2ECC71]/20"
                    >
                      <span className="text-6xl font-bold bg-gradient-to-br from-[#2ECC71] to-[#1E8449] text-transparent bg-clip-text mb-2 transition-transform group-hover:scale-110">ع</span>
                      <span className="text-sm font-medium text-[#5B5B70]">العربية</span>
                    </button>

                    <button
                      onClick={() => updateProfile({ language: "Turkish" })}
                      className="group flex flex-col items-center justify-center aspect-square bg-white rounded-3xl shadow-[0_8px_24px_rgba(243,156,18,0.12)] hover:shadow-[0_16px_32px_rgba(243,156,18,0.2)] transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#F39C12]/20"
                    >
                      <span className="text-5xl font-bold bg-gradient-to-br from-[#F39C12] to-[#B9770E] text-transparent bg-clip-text mb-2 transition-transform group-hover:scale-110">T</span>
                      <span className="text-sm font-medium text-[#5B5B70]">Türkçe</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="flex-1 flex flex-col items-center justify-center text-center py-10 gap-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Animated logo */}
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6C7CFF] via-[#9B6CFF] to-[#C86CFF] flex items-center justify-center shadow-[0_12px_32px_rgba(108,124,255,0.4)]"
                    animate={{ scale: [1, 1.04, 1], rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Image src="/logo1.png" alt="Talk Cars" width={56} height={56} className="w-12 h-12 object-contain" />
                  </motion.div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#14142B] mb-2">{t.empty.greeting}</h2>
                    <p className="text-[#5B5B70] text-sm max-w-[260px] leading-relaxed">
                      {t.empty.subtitle}
                    </p>
                  </div>

                  {/* Feature pills */}
                  <div className="flex flex-wrap justify-center gap-2 max-w-xs">
                    {t.empty.pills.map((label) => (
                      <span key={label} className="px-3 py-1.5 rounded-full bg-white/70 border border-[#E8E8F8] text-xs text-[#5B5B70] font-medium shadow-sm">
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="w-full">
                    <SuggestedChips onSelect={handleSend} />
                  </div>
                </motion.div>
              )
            ) : (
              <>
                {messages.map((msg, i) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isLast={i === messages.length - 1}
                    index={i}
                  />
                ))}
              </>
            )}

            {/* Typing indicator */}
            <AnimatePresence>
              {showTypingIndicator && <TypingIndicator />}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* ── Error toast ─────────────────────────── */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mx-4 mb-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs flex items-center justify-between"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <span>⚠️ {error}</span>
                <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-600 font-bold" aria-label="Dismiss error">×</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Suggested chips ─────────────────────── */}
          {messages.length > 0 && messages.length < 5 && !isStreaming && (
            <div className="px-4 py-2 border-t border-white/30">
              <SuggestedChips onSelect={handleSend} />
            </div>
          )}

          {/* ── Input bar ───────────────────────────── */}
          <div className="flex-shrink-0 px-4 pt-2 pb-4 pb-safe border-t border-white/50 bg-white/50 backdrop-blur-sm">
            <ChatInput onSend={handleSend} disabled={isStreaming} />
          </div>
        </div>
      </div>
    </div>
  );
}
