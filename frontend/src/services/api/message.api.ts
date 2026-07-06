import api from "@/lib/axios";

export async function createConversationApi(
  vendorId: string
) {
  try {
    const { data } = await api.post(
      "/chat/conversation",
      {
        vendorId,
      }
    );

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to create conversation.",
    };
  }
}

export async function getConversationsApi() {
  try {
    const { data } = await api.get(
      "/chat/conversations"
    );

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to load conversations.",
    };
  }
}

export async function getMessagesApi(
  conversationId: string
) {
  try {
    const { data } = await api.get(
      `/chat/conversations/${conversationId}/messages`
    );

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to load messages.",
    };
  }
}

export async function sendMessageApi(
  conversationId: string,
  receiverId: string,
  message: string
) {
  try {
    const { data } = await api.post(
      "/chat/messages",
      {
        conversationId,
        receiverId,
        message,
      }
    );

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      error:
        error.response?.data?.message ??
        "Unable to send message.",
    };
  }
}