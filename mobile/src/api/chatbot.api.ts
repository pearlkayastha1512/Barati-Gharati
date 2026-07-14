import api from "./axios";

export type ChatRole = "USER" | "ASSISTANT";

export type BackendChatMessage = {
  id: string;
  userId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type VendorSuggestion = {
  id: string;
  businessName: string;
  category: string;
};

export type SendMessageResponse = {
  reply: string;
  vendors: VendorSuggestion[];
};

export const getChatHistory = async (): Promise<BackendChatMessage[]> => {
  const response = await api.get<BackendChatMessage[]>("/chatbot/history");
  return response.data;
};

export const sendChatMessage = async (message: string): Promise<SendMessageResponse> => {
  const response = await api.post<SendMessageResponse>("/chatbot/message", { message });
  return response.data;
};