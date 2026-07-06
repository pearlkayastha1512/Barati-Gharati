"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

import { ChatMessage } from "@/store/chatbotStore";

interface Props {
  message: ChatMessage;
}

export default function MessageBubble({
  message,
}: Props) {
  const isBot = message.sender === "bot";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`flex items-end gap-3 ${
        isBot ? "" : "justify-end"
      }`}
    >
      {/* Bot Avatar */}

      {isBot && (
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-rose-500
            via-pink-500
            to-red-500
            text-white
            shadow-md
          "
        >
          <Bot size={18} />
        </div>
      )}

      {/* Message Bubble */}

      <div
        className={`
          max-w-[82%]
          rounded-3xl
          px-4
          py-3
          shadow-sm
          break-words
          ${
            isBot
              ? `
                rounded-bl-md
                border
                border-slate-200
                bg-white
                text-slate-700
              `
              : `
                rounded-br-md
                bg-gradient-to-r
                from-rose-500
                via-pink-500
                to-red-500
                text-white
              `
          }
        `}
      >
        <p className="whitespace-pre-wrap text-sm leading-6">
          {message.text}
        </p>

        <p
          className={`mt-2 text-[10px] ${
            isBot
              ? "text-slate-400"
              : "text-white/75"
          }`}
        >
          {new Date(
            message.createdAt
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* User Avatar */}

      {!isBot && (
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-slate-900
            text-white
            shadow-md
          "
        >
          <User size={17} />
        </div>
      )}
    </motion.div>
  );
}