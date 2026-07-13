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
    console.log("fetchConversations called");

    set({
      isLoading: true,
      error: null,
    });

    try {
      const conversations = await getVendorConversations();

      console.log("CHAT RESPONSE =>", conversations);

      set({
        conversations,
        isLoading: false,
      });
    } catch (error: any) {
      console.log(
        "CHAT ERROR =>",
        error?.response?.data ?? error.message
      );

      set({
        isLoading: false,
        error:
          error?.response?.data?.message ??
          "Unable to load conversations.",
      });
    }
  },
}));