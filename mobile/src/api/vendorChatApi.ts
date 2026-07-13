import api from "./axios";

export interface Conversation {
  id: string;

  customer: {
    id: string;
    name: string;
  };

  vendor: {
    id: string;
    user: {
      id: string;
      name: string;
    };
  };

  messages: {
    id: string;
    senderId: string;
    receiverId: string;
    message: string;
    createdAt: string;
  }[];
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
}

export const getVendorConversations = async () => {
  const { data } = await api.get<Conversation[]>("/chat/conversations");
  return data;
};

export const getConversationMessages = async (
  conversationId: string
) => {
  const { data } = await api.get<ChatMessage[]>(
    `/chat/conversations/${conversationId}/messages`
  );

  return data;
};

export const sendVendorMessage = async (
  conversationId: string,
  receiverId: string,
  message: string
) => {
  const { data } = await api.post("/chat/messages", {
    conversationId,
    receiverId,
    message,
  });

  return data;
};