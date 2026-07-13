import api from "./axios";

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
}

export const getMessages = async (
  conversationId: string
) => {
  const { data } = await api.get<ChatMessage[]>(
    `/chat/conversations/${conversationId}/messages`
  );

  return data;
};

export const sendMessage = async (
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