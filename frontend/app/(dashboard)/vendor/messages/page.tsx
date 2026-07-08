"use client";

import { useEffect } from "react";

import MessagesHero from "@/components/vendor/messages/MessagesHero";

import ChatList from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";

import { useMessageStore } from "@/store/messageStore";

export default function VendorMessagesPage() {
  const {
  initializeSocket,
  disconnectSocket,
} = useMessageStore();

useEffect(() => {
  initializeSocket();

  return () => {
    disconnectSocket();
  };
}, [disconnectSocket, initializeSocket]);
  return (
    <main className="flex h-[calc(100vh-9rem)] min-h-0 flex-col space-y-6 overflow-hidden">

      <MessagesHero />

      <section
        className="
          grid
          min-h-0
          flex-1
          grid-cols-[360px_1fr]
          gap-6
        "
      >

        {/* Conversations */}

        <div className="min-h-0 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">

          <ChatList />

        </div>

        {/* Chat */}

        <div className="flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">

          <div className="min-h-0 flex-1 overflow-hidden">

            <ChatWindow />

          </div>

          <ChatInput />

        </div>

      </section>

    </main>
  );
}
