import { create } from "zustand";
import { AxiosError } from "axios";
import {
  getConversations,
  createConversation,
  getMessages,
  sendMessageApi,
  BackendConversation,
  BackendMessage,
} from "../api/chat.api";
import { useAuthStore } from "./authStore";

export type ChatMessage = {
  id: string;
  text: string;
  fromUser: boolean;
  timestamp: string;
};

export type Conversation = {
  id: string;
  vendorId: string;
  vendorUserId: string;
  vendorName: string;
  vendorAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const mapMessage = (msg: BackendMessage, currentUserId: string): ChatMessage => ({
  id: msg.id,
  text: msg.message,
  fromUser: msg.senderId === currentUserId,
  timestamp: formatTime(msg.createdAt),
});

const mapConversation = (conv: BackendConversation): Conversation => {
  const lastMsg = conv.messages?.[0];
  return {
    id: conv.id,
    vendorId: conv.vendor.id,
    vendorUserId: conv.vendor.user.id,
    vendorName: conv.vendor.businessName || conv.vendor.user.name,
    vendorAvatar: conv.vendor.logoUrl || "https://i.pravatar.cc/100",
    lastMessage: lastMsg?.message ?? "",
    lastMessageTime: lastMsg ? formatTime(lastMsg.createdAt) : "",
    messages: [],
  };
};

interface MessagesState {
  conversations: Conversation[];
  isLoading: boolean;

  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (
    conversationId: string,
    text: string,
  ) => Promise<{ success: boolean; error?: string }>;
  addIncomingMessage: (conversationId: string, message: ChatMessage) => void;
  startConversation: (vendorId: string, vendorName?: string, vendorImage?: string) => Promise<string>;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  conversations: [],
  isLoading: false,

  fetchConversations: async () => {
    try {
      set({ isLoading: true });
      const data = await getConversations();
      const mapped = data.map(mapConversation);
      set({ conversations: mapped, isLoading: false });
    } catch (error) {
      console.log("FETCH CONVERSATIONS ERROR =>", error);
      set({ isLoading: false });
    }
  },

  fetchMessages: async (conversationId) => {
    try {
      const currentUserId = useAuthStore.getState().user?.id ?? "";
      const data = await getMessages(conversationId);
      const mappedMessages = data.map((m) => mapMessage(m, currentUserId));
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? { ...c, messages: mappedMessages } : c
        ),
      }));
    } catch (error) {
      console.log("FETCH MESSAGES ERROR =>", error);
    }
  },

  sendMessage: async (conversationId, text) => {
    const conversation = get().conversations.find((c) => c.id === conversationId);
    if (!conversation) {
      return { success: false, error: "Conversation nahi mili." };
    }

    try {
      await sendMessageApi({
        conversationId,
        receiverId: conversation.vendorUserId,
        message: text,
      });
      // The real message comes back via the socket "newMessage" event,
      // which ChatScreen listens for and appends via addIncomingMessage.
      return { success: true };
    } catch (error) {
      console.log("SEND MESSAGE ERROR =>", error);
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

  addIncomingMessage: (conversationId, message) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, message],
              lastMessage: message.text,
              lastMessageTime: message.timestamp,
            }
          : c
      ),
    }));
  },

  startConversation: async (vendorId, vendorName, vendorImage) => {
    const existing = get().conversations.find((c) => c.vendorId === vendorId);
    if (existing) {
      console.log("Found existing local conversation:", existing.id);
      return existing.id;
    }

    // TEMPORARY: create a conversation locally instead of hitting the backend,
    // since real vendors don't exist in the DB yet. Remove this once vendor
    // registration is live and swap back to the real createConversation() call.
    const localConversation: Conversation = {
      id: `local-${vendorId}-${Date.now()}`,
      vendorId,
      vendorUserId: vendorId,
      vendorName: vendorName ?? "Vendor",
      vendorAvatar: vendorImage ?? "https://i.pravatar.cc/100",
      lastMessage: "",
      lastMessageTime: "",
      messages: [],
    };

    set((state) => ({
      conversations: [...state.conversations, localConversation],
    }));

    console.log("Created LOCAL conversation:", localConversation.id);
    return localConversation.id;
  },
}));
