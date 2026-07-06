import {
  createConversationApi,
  getConversationsApi,
  getMessagesApi,
  sendMessageApi,
} from "@/services/api/message.api";

class MessageService {
  async createConversation(vendorId: string) {
    return await createConversationApi(vendorId);
  }

  async getConversations() {
    return await getConversationsApi();
  }

  async getMessages(conversationId: string) {
    return await getMessagesApi(conversationId);
  }

  async sendMessage(
    conversationId: string,
    receiverId: string,
    message: string
  ) {
    return await sendMessageApi(
      conversationId,
      receiverId,
      message
    );
  }
}

export const messageService =
  new MessageService();
