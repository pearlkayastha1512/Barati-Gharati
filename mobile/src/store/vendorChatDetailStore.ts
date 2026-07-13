import { create } from "zustand";
import {
  ChatMessage,
  getMessages,
  sendMessage,
} from "../api/vendorChatDetailApi";

interface VendorChatDetailState {
  messages: ChatMessage[];

  loading: boolean;

  fetchMessages: (
    conversationId: string
  ) => Promise<void>;

  sendChatMessage: (
    conversationId: string,
    receiverId: string,
    message: string
  ) => Promise<void>;

  addIncomingMessage: (
    message: ChatMessage
  ) => void;
}

export const useVendorChatDetailStore =
  create<VendorChatDetailState>((set, get) => ({
    messages: [],

    loading: false,

    fetchMessages: async (conversationId) => {
      set({
        loading: true,
      });

      try {
        const messages =
          await getMessages(conversationId);

        set({
          messages,
          loading: false,
        });
      } catch (e) {
        console.log(e);

        set({
          loading: false,
        });
      }
    },

    sendChatMessage: async (
      conversationId,
      receiverId,
      message
    ) => {
      const newMessage =
        await sendMessage(
          conversationId,
          receiverId,
          message
        );

      set({
        messages: [
          ...get().messages,
          newMessage,
        ],
      });
    },

    addIncomingMessage: (message) => {
      const exists = get().messages.some(
        (m) => m.id === message.id
      );

      if (exists) return;

      set({
        messages: [
          ...get().messages,
          message,
        ],
      });
    },
  }));