"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Sparkles,
} from "lucide-react";

import { useChatbotStore } from "@/store/chatbotStore";
import ChatHeader from "./ChatHeader";

import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const {
    isOpen,
    close,
  } = useChatbotStore();

  return (
    <AnimatePresence>
      {isOpen && (
     <motion.div
  initial={{
    opacity: 0,
    scale: 0.9,
    y: 40,
  }}
  animate={{
    opacity: 1,
    scale: 1,
    y: 0,
  }}
  exit={{
    opacity: 0,
    scale: 0.9,
    y: 40,
  }}
  transition={{
    duration: 0.25,
  }}
  className="
fixed
bottom-6
right-6
z-[99999]
flex
h-[650px]
max-h-[90vh]
w-[420px]
max-w-[calc(100vw-24px)]
flex-col
overflow-hidden
rounded-[28px]
border
border-slate-200
bg-white
shadow-[0_25px_70px_rgba(0,0,0,0.18)]
"
>
  <ChatHeader />

  <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
    <ChatMessages />
    <ChatInput />
  </div>
</motion.div>
      )}
    </AnimatePresence>
  );
}