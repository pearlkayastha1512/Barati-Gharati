"use client";

import { create } from "zustand";

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  createdAt: string;
}

interface ChatbotStore {
  isOpen: boolean;

  isTyping: boolean;

  isListening: boolean;

  messages: ChatMessage[];

  open: () => void;

  close: () => void;

  toggle: () => void;

  setTyping: (value: boolean) => void;

  setListening: (value: boolean) => void;

  addMessage: (
    message: ChatMessage
  ) => void;

  clearMessages: () => void;
}

export const useChatbotStore =
  create<ChatbotStore>((set) => ({
    isOpen: false,

    isTyping: false,

    isListening: false,

    messages: [],

    open: () =>
      set({
        isOpen: true,
      }),

    close: () =>
      set({
        isOpen: false,
      }),

    toggle: () =>
      set((state) => ({
        isOpen: !state.isOpen,
      })),

    setTyping: (value) =>
      set({
        isTyping: value,
      }),

    setListening: (value) =>
      set({
        isListening: value,
      }),

    addMessage: (message) =>
      set((state) => ({
        messages: [
          ...state.messages,
          message,
        ],
      })),

    clearMessages: () =>
      set({
        messages: [],
      }),
  }));