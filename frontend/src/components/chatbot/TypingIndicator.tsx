"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      {/* Bot Avatar */}

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

      {/* Bubble */}

      <div
        className="
          rounded-3xl
          rounded-bl-md
          border
          border-slate-200
          bg-white
          px-4
          py-3
          shadow-sm
        "
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              animate={{
                y: [0, -5, 0],
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: dot * 0.15,
              }}
              className="
                h-2
                w-2
                rounded-full
                bg-rose-500
              "
            />
          ))}
        </div>
      </div>
    </div>
  );
}