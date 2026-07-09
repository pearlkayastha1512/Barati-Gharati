"use client";

import { MessageCircle, Phone, Video } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useMessageStore } from "@/store/messageStore";

export default function ChatWindow() {
  const { user } = useAuthStore();

  const {
    messages,
    conversations,
    selectedConversation,
  } = useMessageStore();

  const conversation = conversations.find(
    (item) => item.id === selectedConversation
  );

  if (!selectedConversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-white to-rose-50">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-rose-100">
          <MessageCircle
            size={42}
            className="text-rose-500"
          />
        </div>

        <h2 className="mt-6 text-3xl font-bold text-slate-800">
          Your Messages
        </h2>

        <p className="mt-3 text-center text-slate-500">
          Select a conversation to start chatting.
        </p>
      </div>
    );
  }

  const otherUserName =
    user?._id === conversation?.customerId
      ? conversation?.vendor?.businessName ??
        "Vendor"
      : conversation?.customer?.name ??
        "Customer";

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}

      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-pink-100">
            <MessageCircle
              size={24}
              className="text-rose-500"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {otherUserName}
            </h2>

            <p className="text-sm text-green-500">
              ● Online
            </p>
          </div>
        </div>

        {/* <div className="flex gap-3">
          <button className="rounded-full bg-slate-100 p-3 transition hover:bg-rose-100">
            <Phone
              size={18}
              className="text-slate-600"
            />
          </button>

          <button className="rounded-full bg-slate-100 p-3 transition hover:bg-rose-100">
            <Video
              size={18}
              className="text-slate-600"
            />
          </button>
        </div> */}
      </div>

      {/* Chat Area */}

      <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto bg-gradient-to-br from-white via-rose-50 to-pink-50 p-8">
        <div className="mb-8 flex justify-center">
          <span className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-slate-500 shadow">
            Today
          </span>
        </div>

        <div className="space-y-5">
          {messages.map((message) => {
            const mine =
              message.senderId === user?._id;

            return (
              <div
                key={message.id}
                className={`flex ${
                  mine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-[28px] px-6 py-4 shadow-md ${
                    mine
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                      : "border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words leading-7">
                    {message.message}
                  </p>

                  <p
                    className={`mt-2 text-right text-xs ${
                      mine
                        ? "text-rose-100"
                        : "text-slate-400"
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
