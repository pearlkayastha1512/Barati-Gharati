import api from "@/lib/axios";

export async function sendMessageApi(
  message: string
) {
  try {
    const { data } = await api.post(
      "/chatbot/message",
      {
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


export async function sendVoiceMessageApi(
  audio: Blob
) {
  try {
    const formData = new FormData();

    formData.append(
      "audio",
      audio,
      "voice.webm"
    );

    const { data } = await api.post(
      "/chatbot/voice-message",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
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
        "Unable to process voice message.",
    };
  }
}
export async function getHistoryApi() {
  try {
    const { data } = await api.get(
      "/chatbot/history"
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
        "Unable to load history.",
    };
  }

  
}