"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { History, Plus, Car } from "lucide-react";
import { useChatStore } from "@/lib/store";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ChatInput } from "@/components/chat/ChatInput";
import { SuggestedChips } from "@/components/chat/SuggestedChips";
import { ProfileProgress } from "@/components/chat/ProfileProgress";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { ChatHistory } from "@/components/chat/ChatHistory";
import type { ChatMessage, UserProfile } from "@/types/chat";

/* ─── Helpers ─────────────────────────────────────────────── */

function parseProfileUpdate(text: string): Partial<UserProfile> {
  const match = text.match(/<!--profile:(\{.*?\})-->/s);
  if (!match) return {};
  try { return JSON.parse(match[1]) as Partial<UserProfile>; }
  catch { return {}; }
}

/**
 * Split a completed AI response into logical message chunks.
 * We split on double (or more) newlines and group emoji-headed sections.
 * The hidden <!--profile:--> tag is preserved on the last chunk only.
 */
function splitIntoMessages(rawContent: string, baseId: string): ChatMessage[] {
  // Extract the profile tag so we can re-attach it to the last part
  const profileMatch = rawContent.match(/(<!--profile:\{.*?\}-->)/s);
  const profileTag = profileMatch?.[1] ?? "";
  const clean = rawContent.replace(/<!--profile:\{.*?\}-->/gs, "").trim();

  // Split on blank lines (2+ newlines)
  const parts = clean
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 10); // drop stray whitespace chunks

  if (parts.length <= 1) {
    return [{ id: baseId, role: "assistant", content: rawContent, timestamp: Date.now() }];
  }

  const now = Date.now();
  return parts.map((part, i) => ({
    id: i === 0 ? baseId : `${baseId}-${i}`,
    role: "assistant" as const,
    content: i === parts.length - 1 && profileTag ? `${part}\n${profileTag}` : part,
    timestamp: now + i * 80, // stagger timestamps slightly for ordering
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
          updateLastMessage(fullContent);
        }

        // Parse profile
        const profileUpdates = parseProfileUpdate(fullContent);
        if (Object.keys(profileUpdates).length > 0) updateProfile(profileUpdates);

        // Split response into multiple bubbles
        const split = splitIntoMessages(fullContent, aiMsgId);
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
    <div className="relative min-h-dvh bg-[#F5F6FC] flex items-stretch justify-center overflow-hidden">
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
      <div className="relative z-10 w-full max-w-[540px] flex flex-col min-h-dvh">
        <div className="flex-1 flex flex-col md:my-5 md:rounded-[32px] md:overflow-hidden md:shadow-[0_28px_90px_rgba(108,124,255,0.18)] glass">

          {/* ── Header ─────────────────────────────── */}
          <header className="flex items-center justify-between px-4 py-3 border-b border-white/50 bg-white/60 backdrop-blur-xl flex-shrink-0">
            {/* Left: History + New */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setHistoryOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#5B5B70] hover:bg-white/70 hover:text-[#6C7CFF] transition-all duration-150"
                aria-label="Open chat history"
              >
                <History className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={handleNewChat}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#5B5B70] hover:bg-white/70 hover:text-[#6C7CFF] transition-all duration-150"
                aria-label="New conversation"
              >
                <Plus className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Center: Brand */}
            <Link href="/" className="flex flex-col items-center group">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6C7CFF] to-[#C86CFF] flex items-center justify-center shadow-md">
                  <Car className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-[#14142B] text-[15px] tracking-tight group-hover:text-[#6C7CFF] transition-colors">
                  AutoMind
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <OnlineDot />
                <span className="text-[11px] text-[#7B7B90]">Car Expert AI</span>
              </div>
            </Link>

            {/* Right: Profile progress */}
            <div className="flex items-center justify-end w-[72px]">
              <ProfileProgress profile={profile} />
            </div>
          </header>

          {/* ── Messages ───────────────────────────── */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-5 flex flex-col gap-4" id="message-list">
            {showEmptyState ? (
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
                  <Car className="w-10 h-10 text-white" />
                </motion.div>

                <div>
                  <h2 className="text-2xl font-bold text-[#14142B] mb-2">Hello there! 👋</h2>
                  <p className="text-[#5B5B70] text-sm max-w-[260px] leading-relaxed">
                    I'm AutoMind — your AI car expert. Ask me anything about cars!
                  </p>
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap justify-center gap-2 max-w-xs">
                  {["🏎️ Compare cars", "🔋 Best EVs", "💰 Find deals", "🔧 Fix it"].map((label) => (
                    <span key={label} className="px-3 py-1.5 rounded-full bg-white/70 border border-[#E8E8F8] text-xs text-[#5B5B70] font-medium shadow-sm">
                      {label}
                    </span>
                  ))}
                </div>

                <div className="w-full">
                  <SuggestedChips onSelect={handleSend} />
                </div>
              </motion.div>
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
