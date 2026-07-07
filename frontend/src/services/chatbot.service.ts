import {
  sendMessageApi,
  getHistoryApi,
} from "@/services/api/chatbot.api";
import { sendVoiceMessageApi } from "@/services/api/chatbot.api";

export async function sendChatMessage(
  message: string
) {
  const result =
    await sendMessageApi(message);

  if (!result.ok) {
    return null;
  }

  return result.data;
}
export async function sendVoiceMessage(
  audio: Blob
) {
  const result =
    await sendVoiceMessageApi(audio);

  if (!result.ok) {
    return null;
  }

  return result.data;
}
// export async function getChatHistory() {
//   const result =
//     await getHistoryApi();

//   if (!result.ok) {
//     return [];
//   }

//   return result.data;
// }