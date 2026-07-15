import { create } from "zustand";
import {
  getVendorConversations,
  Conversation,
} from "../api/vendorChatApi";

interface VendorChatState {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;

  fetchConversations: () => Promise<void>;
}

export const useVendorChatStore = create<VendorChatState>((set) => ({
  conversations: [],
  isLoading: false,
  error: null,

  fetchConversations: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const conversations = await getVendorConversations();

      set({
        conversations,
        isLoading: false,
      });
    } catch (error: any) {
      const responseMessage =
        error?.response?.data?.message;

      const message = Array.isArray(responseMessage)
        ? responseMessage.join(" ")
        : responseMessage;

      set({
        isLoading: false,
        error:
          typeof message === "string"
            ? message
            : !error?.response
              ? "Backend server se connection nahi ho pa raha hai."
              : "Unable to load conversations.",
      });
    }
  },
}));
