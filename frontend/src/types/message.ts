export type MessageStatus =
  | "SENT"
  | "DELIVERED"
  | "READ";

export interface Message {
  id: string;

  conversationId: string;

  senderId: string;

  receiverId: string;

  message: string;

  status: MessageStatus;

  createdAt: string;
}

export interface Conversation {
  id: string;

  customerId: string;

  vendorId: string;

  createdAt: string;

  updatedAt: string;

  customer?: {
    id: string;
    name: string;
  };

  vendor?: {
    id: string;
    businessName: string;
    user?: {
      id: string;
      name: string;
    };
  };

  messages?: Message[];
}