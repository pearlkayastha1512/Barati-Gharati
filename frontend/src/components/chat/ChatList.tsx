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
  }, [loadConversations]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}

      <div className="border-b border-[#ffb3bf] p-5">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff8fa1]"
          />

          <input
            type="text"
            placeholder="Search conversations..."
            className="
              h-12
              w-full
              rounded-2xl
              border
              border-[#ffb3bf]
              bg-[#fffdf0]
              pl-12
              pr-4
              text-sm
              text-[#6c2d45]
              outline-none
              transition
              placeholder:text-[#ff8fa1]
              focus:border-[#ff8fa1]
              focus:bg-[#fffdf0]
            "
          />
        </div>
      </div>

      {/* Conversation List */}

      <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
        {conversations.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-[#ff8fa1]">
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
