import { create } from "zustand";
import {
  ChatMessage,
  getMessages,
  sendMessage,
} from "../api/vendorChatDetailApi";
import { AxiosError } from "axios";

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
  ) => Promise<{ success: boolean; error?: string }>;

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
        messages: [],
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
      try {
        const newMessage = await sendMessage(
          conversationId,
          receiverId,
          message
        );

        set({
          messages: get().messages.some((item) => item.id === newMessage.id)
            ? get().messages
            : [...get().messages, newMessage],
        });

        return { success: true };
      } catch (error) {
        if (error instanceof AxiosError) {
          const responseMessage = error.response?.data?.message;
          const message = Array.isArray(responseMessage)
            ? responseMessage.join(" ")
            : responseMessage;

          if (typeof message === "string" && message.trim()) {
            return { success: false, error: message };
          }

          if (!error.response) {
            return {
              success: false,
              error: "Backend server se connection nahi ho pa raha hai.",
            };
          }
        }

        return {
          success: false,
          error: "Message send nahi ho saka. Please try again.",
        };
      }
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
