

"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { useChatbotStore } from "@/store/chatbotStore";

import ChatWindow from "./ChatWindow";

export default function Chatbot() {
  const { isOpen, open } = useChatbotStore();

  return (
    <>
      <ChatWindow />

      {!isOpen && (
        <motion.button
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          whileHover={{
            scale: 1.08,
          }}
          whileTap={{
            scale: 0.92,
          }}
          onClick={open}
          className="
            fixed
            bottom-6
            right-6
            z-[9999]
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-rose-500
            via-pink-500
            to-red-500
            text-white
            shadow-[0_15px_45px_rgba(244,63,94,0.45)]
          "
        >
          {/* Pulse */}
          <span
            className="
              absolute
              inset-0
              animate-ping
              rounded-full
              bg-rose-400
              opacity-20
            "
          />

          {/* Glow */}
          <span
            className="
              absolute
              inset-0
              rounded-full
              bg-white/10
            "
          />

          <Bot
            size={34}
            className="relative z-10"
          />

          {/* AI Badge */}
          <div
            className="
              absolute
              -right-1
              -top-1
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-white
              text-rose-500
              shadow-lg
            "
          >
            <Sparkles size={15} />
          </div>
        </motion.button>
      )}
    </>
  );
}