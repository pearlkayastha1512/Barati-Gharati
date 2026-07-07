"use client";

import { KeyboardEvent, useState } from "react";
import { motion } from "framer-motion";
import { Send, Smile } from "lucide-react";

import VoiceButton from "./VoiceButton";
import { useChatbotStore } from "@/store/chatbotStore";
import { sendChatMessage } from "@/services/chatbot.service";


export default function ChatInput() {
  const [text, setText] = useState("");

  const { addMessage, setTyping } = useChatbotStore();

//   const sendMessage = () => {

//     if (!text.trim()) return;

//     addMessage({
//       id: crypto.randomUUID(),
//       sender: "user",
//       text,
//       createdAt: new Date().toISOString(),
//     });

//     const message = text;
//     setText("");
//     setTyping(true);

//     setTimeout(() => {
//       addMessage({
//         id: crypto.randomUUID(),
//         sender: "bot",
//         text: `You said: "${message}"

// Once we connect your chatbot backend, I'll answer this intelligently.`,
//         createdAt: new Date().toISOString(),
//       });

//       setTyping(false);
//     }, 1200);
//   };



const sendMessage = async () => {
  if (!text.trim()) {
    return;
  }

  const message = text.trim();

  addMessage({
    id: crypto.randomUUID(),
    sender: "user",
    text: message,
    createdAt: new Date().toISOString(),
  });

  setText("");

  setTyping(true);

  try {
    const response =
      await sendChatMessage(message);

    addMessage({
      id: crypto.randomUUID(),
      sender: "bot",
      text:
        response?.reply ??
        response?.message ??
        "No response received.",
      createdAt:
        new Date().toISOString(),
    });
  } catch {
    addMessage({
      id: crypto.randomUUID(),
      sender: "bot",
      text:
        "Sorry, something went wrong.",
      createdAt:
        new Date().toISOString(),
    });
  } finally {
    setTyping(false);
  }
};


  // const handleKeyDown = (
  //   e: KeyboardEvent<HTMLInputElement>
  // ) => {
  //   if (e.key === "Enter") {
  //     sendMessage();
  //   }
  // };

//   e: KeyboardEvent<HTMLInputElement>
// ) => {
//   if (e.key === "Enter") {
//     await sendMessage();
//   }
// };

const handleKeyDown = async (
  e: KeyboardEvent<HTMLInputElement>
) => {
  if (e.key === "Enter") {
    await sendMessage();
  }
};
  return (
    <div
      className="
        shrink-0
        border-t
        border-slate-200
        bg-white
        p-3
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          rounded-2xl
          border
          border-slate-200
          bg-slate-50
          px-3
          py-2
          shadow-sm
        "
      >
        {/* Emoji */}

        <button
          className="
            rounded-lg
            p-2
            text-slate-500
            transition
            hover:bg-slate-200
          "
        >
          <Smile size={18} />
        </button>

        {/* Input */}

        <input
          type="text"
          value={text}
          placeholder="Ask anything..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="
            flex-1
            bg-transparent
            text-sm
            text-slate-700
            outline-none
            placeholder:text-slate-400
          "
        />

        {/* Voice */}

        <VoiceButton
  value={text}
  onChange={setText}
/>
        {/* Send */}

        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
         onClick={() => void sendMessage()}
          disabled={!text.trim()}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-gradient-to-r
            from-rose-500
            to-pink-500
            text-white
            shadow-md
            transition
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Send size={17} />
        </motion.button>
      </div>
    </div>
  );
}