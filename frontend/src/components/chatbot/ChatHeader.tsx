"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  Minimize2,
  X,
} from "lucide-react";

import { useChatbotStore } from "@/store/chatbotStore";

export default function ChatHeader() {
  const { close } = useChatbotStore();

  return (
    <div
      className="
        relative
        shrink-0
        overflow-hidden
        rounded-t-[28px]
        bg-gradient-to-r
        from-rose-500
        via-pink-500
        to-red-500
        px-5
        py-4
        text-white
      "
    >
      {/* Background Glow */}

      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
        }}
        className="
          absolute
          -right-10
          -top-10
          h-32
          w-32
          rounded-full
          bg-white/10
          blur-3xl
        "
      />

      <div className="relative flex items-center justify-between">

        {/* Left */}

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-white/20
              backdrop-blur
            "
          >
            <Bot size={24} />
          </div>

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-lg font-bold">
                WedPlan AI
              </h2>

              <Sparkles
                size={14}
                className="text-yellow-300"
              />

            </div>

            <div className="mt-1 flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-green-400" />

              <p className="text-xs text-white/90">
                Online • Ready to help
              </p>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-1">

          <button
            className="
              rounded-lg
              p-2
              transition
              hover:bg-white/20
            "
          >
            <Minimize2 size={17} />
          </button>

          <button
            onClick={close}
            className="
              rounded-lg
              p-2
              transition
              hover:bg-white/20
            "
          >
            <X size={18} />
          </button>

        </div>

      </div>
    </div>
  );
}