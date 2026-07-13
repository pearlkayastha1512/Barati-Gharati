import { create } from "zustand";

import {
  VendorChatMessage,
  VendorSuggestion,
} from "../types/vendorChatbot";

import {
  getVendorChatHistory,
  sendVendorMessage,
  sendVendorVoiceMessage,
} from "../api/vendorChatbot.api";

interface VendorChatbotState {
  messages: VendorChatMessage[];

  vendors: VendorSuggestion[];

  loading: boolean;

  fetchHistory: () => Promise<void>;

  sendMessage: (
    text: string
  ) => Promise<void>;

  sendVoiceMessage: (
    uri: string
  ) => Promise<void>;
}

export const useVendorChatbotStore =
create<VendorChatbotState>((set) => ({

  messages: [],

  vendors: [],

  loading: false,

  fetchHistory: async () => {

    try {

      const history =
        await getVendorChatHistory();

      set({
        messages: history,
      });

    } catch {

      set({
        messages: [],
      });

    }

  },

  sendMessage: async (text) => {

    if (!text.trim()) return;

    const userMessage: VendorChatMessage = {
      role: "USER",
      content: text,
    };

    set((state) => ({
      loading: true,

      messages: [
        ...state.messages,
        userMessage,
      ],
    }));

    try {

      const response =
        await sendVendorMessage(text);

      const botMessage: VendorChatMessage = {
        role: "ASSISTANT",
        content: response.reply,
      };

      set((state) => ({
        loading: false,

        vendors: response.vendors,

        messages: [
          ...state.messages,
          botMessage,
        ],
      }));

    } catch {

      set((state) => ({
        loading: false,

        messages: [
          ...state.messages,
          {
            role: "ASSISTANT",
            content:
              "Something went wrong. Please try again.",
          },
        ],
      }));

    }

  },

  sendVoiceMessage: async (
    uri: string
  ) => {

    set({
      loading: true,
    });

    try {

      const response =
        await sendVendorVoiceMessage(uri);

      const transcriptMessage: VendorChatMessage = {
        role: "USER",
        content: response.transcript,
      };

      const assistantMessage: VendorChatMessage = {
        role: "ASSISTANT",
        content: response.reply,
      };

      set((state) => ({
        loading: false,

        vendors: response.vendors,

        messages: [
          ...state.messages,
          transcriptMessage,
          assistantMessage,
        ],
      }));

    }      catch (error: any) {

      console.log("VOICE ERROR:", error);
      console.log("VOICE RESPONSE:", error?.response?.data);

      set((state) => ({
        loading: false,

        messages: [
          ...state.messages,
          {
            role: "ASSISTANT",
            content: "Voice message failed. Please try again.",
          },
        ],
      }));

    }

  },

}));