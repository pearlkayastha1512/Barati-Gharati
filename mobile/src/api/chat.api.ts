import api from "./axios";

export type BackendUser = { id: string; name: string };

export type BackendVendor = {
  id: string;
  businessName: string;
  logoUrl: string | null;
  user: BackendUser;
};

export type BackendMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  status: string;
  createdAt: string;
};

export type BackendConversation = {
  id: string;
  customerId: string;
  vendorId: string;
  customer: BackendUser;
  vendor: BackendVendor;
  messages: BackendMessage[];
  updatedAt: string;
};

export const getConversations = async (): Promise<BackendConversation[]> => {
  const response = await api.get<BackendConversation[]>("/chat/conversations");
  return response.data;
};

export const createConversation = async (vendorId: string) => {
  const response = await api.post("/chat/conversation", { vendorId });
  return response.data;
};

export const getMessages = async (conversationId: string): Promise<BackendMessage[]> => {
  const response = await api.get<BackendMessage[]>(
    `/chat/conversations/${conversationId}/messages`
  );
  return response.data;
};

export const sendMessageApi = async (payload: {
  conversationId: string;
  receiverId: string;
  message: string;
}): Promise<BackendMessage> => {
  const response = await api.post<BackendMessage>("/chat/messages", payload);
  return response.data;
};