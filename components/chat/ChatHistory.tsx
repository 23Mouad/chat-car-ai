"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, MessageSquare, Trash2, Clock } from "lucide-react";
import { useChatStore, type Conversation } from "@/lib/store";

interface ChatHistoryProps {
  open: boolean;
  onClose: () => void;
  onNew: () => void;
}

function getConversationTitle(conv: Conversation): string {
  const firstUser = conv.messages.find((m) => m.role === "user");
  if (!firstUser) return "New conversation";
  const text = firstUser.content.replace(/<!--profile:\{.*?\}-->/gs, "").trim();
  return text.length > 38 ? text.slice(0, 38) + "…" : text;
}

function getConversationPreview(conv: Conversation): string {
  const lastAI = [...conv.messages].reverse().find((m) => m.role === "assistant");
  if (!lastAI) return "No messages yet";
  const clean = lastAI.content.replace(/<!--profile:\{.*?\}-->/gs, "").replace(/[#*`]/g, "").trim();
  return clean.length > 55 ? clean.slice(0, 55) + "…" : clean;
}

function formatDate(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(ts).toLocaleDateString([], { month: "short", day: "numeric" });
}

export function ChatHistory({ open, onClose, onNew }: ChatHistoryProps) {
  const { conversations, activeId, switchConversation, deleteConversation } = useChatStore();

  const handleSwitch = (id: string) => {
    switchConversation(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed left-0 top-0 bottom-0 z-40 w-[300px] max-w-[85vw] flex flex-col bg-white/90 backdrop-blur-2xl border-r border-white/50 shadow-[4px_0_40px_rgba(108,124,255,0.15)]"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8F8]">
              <div>
                <h2 className="font-bold text-[#14142B] text-base">Chat History</h2>
                <p className="text-xs text-[#9B9BAC] mt-0.5">{conversations.length} conversation{conversations.length !== 1 ? "s" : ""}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#5B5B70] hover:bg-[#F0F0FA] transition-colors"
                aria-label="Close history"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* New chat button */}
            <div className="px-4 py-3 border-b border-[#E8E8F8]">
              <button
                onClick={() => { onNew(); onClose(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6C7CFF] to-[#C86CFF] text-white text-sm font-semibold shadow-[0_4px_14px_rgba(108,124,255,0.35)] hover:shadow-[0_6px_18px_rgba(108,124,255,0.45)] transition-all duration-200"
                aria-label="Start new chat"
              >
                <Plus className="w-4 h-4" />
                New conversation
              </button>
            </div>

            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto py-2">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center px-6 gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#F0F0FA] flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-[#9B9BAC]" />
                  </div>
                  <p className="text-sm text-[#9B9BAC]">No conversations yet. Start chatting!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5 px-2">
                  {conversations.map((conv, i) => {
                    const isActive = conv.id === activeId;
                    return (
                      <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`group relative flex items-start gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-150 ${
                          isActive
                            ? "bg-gradient-to-r from-[#6C7CFF]/10 to-[#C86CFF]/8 border border-[#9B6CFF]/20"
                            : "hover:bg-[#F5F5FC]"
                        }`}
                        onClick={() => handleSwitch(conv.id)}
                      >
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${
                          isActive ? "bg-gradient-to-br from-[#6C7CFF] to-[#C86CFF]" : "bg-[#F0F0FA]"
                        }`}>
                          <MessageSquare className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#9B9BAC]"}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isActive ? "text-[#6C7CFF]" : "text-[#14142B]"}`}>
                            {getConversationTitle(conv)}
                          </p>
                          <p className="text-xs text-[#9B9BAC] truncate mt-0.5 leading-relaxed">
                            {getConversationPreview(conv)}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-2.5 h-2.5 text-[#C0C0D0]" />
                            <span className="text-[10px] text-[#C0C0D0]">{formatDate(conv.updatedAt)}</span>
                            {conv.messages.length > 0 && (
                              <span className="text-[10px] text-[#C0C0D0] ml-1">· {conv.messages.length} msg</span>
                            )}
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(conv.id);
                          }}
                          className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[#C0C0D0] hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-150"
                          aria-label={`Delete conversation`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[#E8E8F8]">
              <p className="text-[10px] text-[#C0C0D0] text-center">Conversations saved locally on this device</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
