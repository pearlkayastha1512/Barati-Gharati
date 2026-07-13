export interface VendorSuggestion {
  id: string;
  businessName: string;
  category: string;
}

export interface VendorChatResponse {
  reply: string;
  vendors: VendorSuggestion[];
}

export interface VendorChatMessage {
  id?: string;

  role: "USER" | "ASSISTANT";

  content: string;

  createdAt?: string;
}