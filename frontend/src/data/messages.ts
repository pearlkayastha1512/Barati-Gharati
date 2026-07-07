import { Message } from "@/types/message";

export const messages: Message[] = [
  {
  id: "MSG001",

  conversationId: "CONV001",

  senderId: "CUS001",

  receiverId: "VEN001",

  message: "Hi, is your wedding package available?",

  createdAt: "2026-08-01T10:30:00Z",

  status: "READ",
},

  {
  id: "MSG002",

  conversationId: "CONV001",

  senderId: "VEN001",

  receiverId: "CUS001",

  message: "Yes, it's available for your date.",

  createdAt: "2026-08-01T10:35:00Z",

  status: "READ",
},

  {
  id: "MSG003",

  conversationId: "CONV002",

  senderId: "CUS002",

  receiverId: "VEN001",

  message: "Can you share your pricing details?",

  createdAt: "2026-08-02T16:15:00Z",

  status: "DELIVERED",
},
];


// All messages
export const getMessages = () => messages;

// Message by id
export const getMessageById = (id: string) =>
  messages.find((message) => message.id === id);

// Conversation between two users
export const getConversation = (
  senderId: string,
  receiverId: string
) =>
  messages.filter(
    (message) =>
      (message.senderId === senderId &&
        message.receiverId === receiverId) ||
      (message.senderId === receiverId &&
        message.receiverId === senderId)
  );

// Inbox for a user
export const getUserMessages = (userId: string) =>
  messages.filter(
    (message) =>
      message.senderId === userId ||
      message.receiverId === userId
  );