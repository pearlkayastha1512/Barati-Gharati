"use client";

import { useEffect } from "react";
import { Search } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useMessageStore } from "@/store/messageStore";

import ConversationCard from "./ConversationCard";

export default function ChatList() {
  const { user } = useAuthStore();

  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    loadConversations,
    loadMessages,
  } = useMessageStore();

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}

      <div className="border-b border-slate-200 p-5">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search conversations..."
            className="
              h-12
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              pl-12
              pr-4
              text-sm
              text-slate-700
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-rose-400
              focus:bg-white
            "
          />
        </div>
      </div>

      {/* Conversation List */}

      <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
        {conversations.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-400">
              No conversations yet
            </p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              name={
                user?._id === conversation.customerId
                  ? conversation.vendor?.businessName ??
                    "Vendor"
                  : conversation.customer?.name ??
                    "Customer"
              }
              lastMessage={
                conversation.messages?.length
                  ? conversation.messages[
                      conversation.messages.length - 1
                    ].message
                  : "Start conversation"
              }
              time={
                conversation.messages?.length
                  ? conversation.messages[
                      conversation.messages.length - 1
                    ].createdAt
                  : conversation.createdAt
              }
              active={
                selectedConversation ===
                conversation.id
              }
              onClick={async () => {
                setSelectedConversation(
                  conversation.id
                );

                await loadMessages(
                  conversation.id
                );
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}