import { create } from "zustand";

import {
  Message,
  Conversation,
} from "@/types/message";

import { messageService } from "@/services/message.service";
import { socket } from "@/lib/socket";
import { toast } from "sonner";

interface MessageStore {
  conversations: Conversation[];

  messages: Message[];

  selectedConversation: string | null;

  loadConversations: () => Promise<void>;

  loadMessages: (
    conversationId: string
  ) => Promise<void>;

  setSelectedConversation: (
    id: string | null
  ) => void;

  sendNewMessage: (
    conversationId: string,
    receiverId: string,
    message: string
  ) => Promise<void>;

  initializeSocket: () => void;

  disconnectSocket: () => void;

  clearConversation: () => void;
}

export const useMessageStore =
  create<MessageStore>((set) => ({
    conversations: [],

    messages: [],

    selectedConversation: null,

    loadConversations: async () => {
      const result =
        await messageService.getConversations();

      if (!result.ok || !result.data) return;

      set({
        conversations: result.data,
      });
    },

    loadMessages: async (
      conversationId
    ) => {
      const result =
        await messageService.getMessages(
          conversationId
        );

      if (!result.ok || !result.data)
        return;

      set({
        messages: result.data,
      });

      socket.emit(
        "joinConversation",
        conversationId
      );
    },

    setSelectedConversation: (id) =>
      set({
        selectedConversation: id,
      }),

    // sendNewMessage: async (

    //   conversationId,
    //   receiverId,
    //   message
    // ) => {
    //   const result =
    //     await messageService.sendMessage(
    //       conversationId,
    //       receiverId,
    //       message
    //     );

    //   if (!result.ok) return;

    //   // Socket automatically new message receive karega.
    //   // Yahan dubara getMessages() call nahi karenge.
    // },
    sendNewMessage: async (
  conversationId,
  receiverId,
  message
) => {
  const result =
    await messageService.sendMessage(
      conversationId,
      receiverId,
      message
    );

  if (!result.ok) {
    toast.error(
      result.error ??
        "Unable to send message.",
      {
        duration: 4000,
      }
    );
    return;
  }
},

    initializeSocket: () => {
      socket.off("newMessage");

      socket.on(
        "newMessage",
        (message: Message) => {
          set((state) => ({
            messages: [
              ...state.messages,
              message,
            ],
          }));
        }
      );
    },

    disconnectSocket: () => {
      socket.off("newMessage");
    },

    clearConversation: () =>
      set({
        selectedConversation: null,
        messages: [],
      }),
  }));