import { create } from "zustand";

export type ChatMessage = {
  id: string;
  text: string;
  fromUser: boolean;
  timestamp: string;
};

export type Conversation = {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
};

interface MessagesState {
  conversations: Conversation[];
  sendMessage: (conversationId: string, text: string) => void;
  startConversation: (vendorId: string, vendorName: string, vendorAvatar: string) => string;
}

// TODO: once backend is connected, replace local state with API-backed state:
// - on mount, fetch via getConversations() and populate `conversations`
// - sendMessage should call sendMessage(conversationId, text) via socket/API
// - startConversation should call getOrCreateConversation(vendorId) on the backend
export const useMessagesStore = create<MessagesState>((set, get) => ({
  conversations: [],

  sendMessage: (conversationId, text) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      fromUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, newMessage], lastMessage: text, lastMessageTime: newMessage.timestamp }
          : c
      ),
    }));
  },

  startConversation: (vendorId, vendorName, vendorAvatar) => {
    const existing = get().conversations.find((c) => c.vendorId === vendorId);
    if (existing) return existing.id;

    const newConversation: Conversation = {
      id: Date.now().toString(),
      vendorId,
      vendorName,
      vendorAvatar,
      lastMessage: "",
      lastMessageTime: "",
      messages: [],
    };
    set((state) => ({ conversations: [newConversation, ...state.conversations] }));
    return newConversation.id;
  },
}));