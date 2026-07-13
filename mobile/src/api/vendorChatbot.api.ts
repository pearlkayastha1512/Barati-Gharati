import api from "./axios";

import {
  VendorChatMessage,
  VendorChatResponse,
} from "../types/vendorChatbot";

export interface VendorVoiceResponse {
  transcript: string;
  reply: string;
  vendors: any[];
}

export const getVendorChatHistory = async () => {
  const res = await api.get<VendorChatMessage[]>(
    "/chatbot/history"
  );

  return res.data;
};

export const sendVendorMessage = async (
  message: string
) => {
  const res = await api.post<VendorChatResponse>(
    "/chatbot/message",
    {
      message,
    }
  );

  return res.data;
};

export const sendVendorVoiceMessage = async (
  uri: string
) => {
  const formData = new FormData();

  formData.append(
    "audio",
    {
      uri,

      name: "voice.webm",

      type: "audio/webm",
    } as any
  );

  console.log("VOICE URI:", uri);

  const response = await api.post<VendorVoiceResponse>(
    "/chatbot/voice-message",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};