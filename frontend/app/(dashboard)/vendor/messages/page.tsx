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
}, []);
  return (
    <main className="space-y-6">

      <MessagesHero />

      <section
        className="
          grid
          h-[82vh]
          grid-cols-[360px_1fr]
          gap-6
        "
      >

        {/* Conversations */}

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">

          <ChatList />

        </div>

        {/* Chat */}

        <div className="flex flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">

          <div className="flex-1 overflow-hidden">

            <ChatWindow />

          </div>

          <ChatInput />

        </div>

      </section>

    </main>
  );
}