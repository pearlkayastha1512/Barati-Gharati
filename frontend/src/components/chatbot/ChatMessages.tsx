"use client";

import { useEffect, useRef } from "react";

import { useChatbotStore } from "@/store/chatbotStore";

import WelcomeScreen from "./WelcomeScreen";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export default function ChatMessages() {
  const { messages, isTyping } = useChatbotStore();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  // Welcome Screen
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 min-h-0 overflow-hidden bg-slate-50">
        <WelcomeScreen />
      </div>
    );
  }

  return (
    <div
      className="
        flex-1
        min-h-0
        overflow-y-auto
        overflow-x-hidden
        overscroll-contain
        bg-slate-50
        px-5
        py-5
      "
    >
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}