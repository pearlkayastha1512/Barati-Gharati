// "use client";

// import { create } from "zustand";
// // import { getChatHistory } from "@/services/chatbot.service";

// export interface ChatMessage {
//   id: string;
//   sender: "user" | "bot";
//   text: string;
//   createdAt: string;
// }

// interface ChatbotStore {
//   isOpen: boolean;

//   isTyping: boolean;

//   isListening: boolean;

//   messages: ChatMessage[];

//   open: () => void;

//   close: () => void;

//   toggle: () => void;

//   loadHistory: () => Promise<void>;

//   setTyping: (value: boolean) => void;

//   setListening: (value: boolean) => void;

//   addMessage: (
//     message: ChatMessage
//   ) => void;

//   clearMessages: () => void;
// }

// export const useChatbotStore =
//   create<ChatbotStore>((set) => ({
//     isOpen: false,

//     isTyping: false,

//     isListening: false,

//     messages: [],

//     open: () =>
//       set({
//         isOpen: true,
//       }),

//     close: () =>
//       set({
//         isOpen: false,
//       }),

//     toggle: () =>
//       set((state) => ({
//         isOpen: !state.isOpen,
//       })),

//     setTyping: (value) =>
//       set({
//         isTyping: value,
//       }),

//     setListening: (value) =>
//       set({
//         isListening: value,
//       }),

//     addMessage: (message) =>
//       set((state) => ({
//         messages: [
//           ...state.messages,
//           message,
//         ],
//       })),

//       loadHistory: async () => {
//   // const history = await getChatHistory();

//   if (!history) {
//     return;
//   }

//   const messages = history.flatMap((item: any) => [
//     {
//       id: `${item.id}-user`,
//       sender: "user" as const,
//       text: item.message,
//       createdAt: item.createdAt,
//     },
//     {
//       id: `${item.id}-bot`,
//       sender: "bot" as const,
//       text: item.reply,
//       createdAt: item.createdAt,
//     },
//   ]);

//   set({
//     messages,
//   });
// },

//     clearMessages: () =>
//       set({
//         messages: [],
//       }),
//   }));



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

  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

export const useChatbotStore = create<ChatbotStore>((set) => ({
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
      messages: [...state.messages, message],
    })),

  clearMessages: () =>
    set({
      messages: [],
    }),
}));