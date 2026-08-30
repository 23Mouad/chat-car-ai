"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  isLast?: boolean;
  index?: number;
}

// Strip hidden profile tags before rendering — last line of defence
function stripProfileTag(content: string): string {
  const idx = content.indexOf("<!--profile:");
  return idx === -1 ? content : content.slice(0, idx).trim();
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Car avatar icon for AI
function CarAvatar() {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#6C7CFF] to-[#C86CFF] flex items-center justify-center shadow-[0_2px_8px_rgba(108,124,255,0.4)]">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
        <rect x="9" y="11" width="14" height="10" rx="2" />
        <circle cx="12" cy="20" r="1" />
        <circle cx="20" cy="20" r="1" />
      </svg>
    </div>
  );
}

// ── Markdown renderer — memoised so it doesn't re-parse on every token ───────
const MemoMarkdown = memo(function MemoMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none
      prose-p:my-1 prose-p:leading-relaxed
      prose-ul:my-1.5 prose-ul:pl-4
      prose-ol:my-1.5 prose-ol:pl-4
      prose-li:my-0.5
      prose-strong:font-semibold prose-strong:text-[#14142B]
      prose-headings:font-bold prose-headings:text-[#14142B] prose-headings:mt-2 prose-headings:mb-1
      prose-code:bg-[#EEF0FF] prose-code:text-[#6C7CFF] prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-xs
    ">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
});

// ── Main bubble — memo stops re-render unless message content changes ─────────
export const MessageBubble = memo(function MessageBubble({
  message,
  isLast,
  index = 0,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  // useMemo: only recompute when content changes (avoids work on sibling re-renders)
  const displayContent = useMemo(
    () => stripProfileTag(message.content),
    [message.content]
  );

  const timeStr = useMemo(() => formatTime(message.timestamp), [message.timestamp]);

  if (!displayContent) return null;

  return (
    <motion.div
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"} items-end`}
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      // Only animate on first appearance; after that transitions are instant
      transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98], delay: Math.min(index * 0.04, 0.2) }}
    >
      {/* Avatar */}
      {!isUser && <CarAvatar />}

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} gap-1 max-w-[82%]`}>
        {/* Bubble */}
        <div
          className={`relative rounded-[20px] px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-gradient-to-br from-[#6C7CFF] via-[#9B6CFF] to-[#C86CFF] text-white rounded-br-[6px] shadow-[0_4px_20px_rgba(108,124,255,0.38)]"
              : "bg-white/90 backdrop-blur-sm border border-[#E8E8F8] text-[#14142B] rounded-bl-[6px] shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap font-medium">{displayContent}</p>
          ) : (
            <MemoMarkdown content={displayContent} />
          )}
        </div>

        {/* Timestamp */}
        <span className={`text-[10px] text-[#B0B0C8] px-1 ${isUser ? "text-right" : "text-left"}`}>
          {timeStr}
        </span>
      </div>
    </motion.div>
  );
});
