"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, UserProfile } from "@/types/chat";

export interface Conversation {
  id: string;
  messages: ChatMessage[];
  profile: Partial<UserProfile>;
  createdAt: number;
  updatedAt: number;
}

interface ChatStore {
  conversations: Conversation[];
  activeId: string | null;
  isStreaming: boolean;

  // Computed helpers (derived from active conversation)
  getActive: () => Conversation | null;

  // Conversation management
  newConversation: () => string;
  switchConversation: (id: string) => void;
  deleteConversation: (id: string) => void;

  // Messaging (operate on active conversation)
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  replaceLastMessages: (messages: ChatMessage[]) => void;
  setStreaming: (value: boolean) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

function makeConversation(): Conversation {
  return {
    id: crypto.randomUUID(),
    messages: [],
    profile: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeId: null,
      isStreaming: false,

      getActive: () => {
        const { conversations, activeId } = get();
        return conversations.find((c) => c.id === activeId) ?? null;
      },

      newConversation: () => {
        const conv = makeConversation();
        set((state) => ({
          conversations: [conv, ...state.conversations],
          activeId: conv.id,
        }));
        return conv.id;
      },

      switchConversation: (id) => {
        set({ activeId: id });
      },

      deleteConversation: (id) => {
        set((state) => {
          const remaining = state.conversations.filter((c) => c.id !== id);
          const newActive =
            state.activeId === id
              ? remaining[0]?.id ?? null
              : state.activeId;
          return { conversations: remaining, activeId: newActive };
        });
      },

      addMessage: (message) =>
        set((state) => {
          if (!state.activeId) return state;
          return {
            conversations: state.conversations.map((c) =>
              c.id === state.activeId
                ? { ...c, messages: [...c.messages, message], updatedAt: Date.now() }
                : c
            ),
          };
        }),

      updateLastMessage: (content) =>
        set((state) => {
          if (!state.activeId) return state;
          return {
            conversations: state.conversations.map((c) => {
              if (c.id !== state.activeId) return c;
              const msgs = [...c.messages];
              if (msgs.length > 0) {
                msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content };
              }
              return { ...c, messages: msgs, updatedAt: Date.now() };
            }),
          };
        }),

      replaceLastMessages: (newMessages) =>
        set((state) => {
          if (!state.activeId) return state;
          return {
            conversations: state.conversations.map((c) => {
              if (c.id !== state.activeId) return c;
              // Remove last message and append the split ones
              const msgs = c.messages.slice(0, -1);
              return {
                ...c,
                messages: [
                  ...msgs,
                  ...newMessages.map((m, i) => ({
                    ...m,
                    id: i === 0 ? m.id : crypto.randomUUID(),
                  })),
                ],
                updatedAt: Date.now(),
              };
            }),
          };
        }),

      setStreaming: (value) => set({ isStreaming: value }),

      updateProfile: (updates) =>
        set((state) => {
          if (!state.activeId) return state;
          return {
            conversations: state.conversations.map((c) =>
              c.id === state.activeId
                ? { ...c, profile: { ...c.profile, ...updates } }
                : c
            ),
          };
        }),
    }),
    {
      name: "automind-v2",
      skipHydration: true,
    }
  )
);
