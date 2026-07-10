
"use client";

import { useState } from "react";
import { SendHorizonal } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useMessageStore } from "@/store/messageStore";
import { toast } from "sonner";

import { validateMessage } from "@/utils/messageValidator";

export default function ChatInput() {
  const [text, setText] = useState("");

  const { user } = useAuthStore();

  const {
    conversations,
    selectedConversation,
    sendNewMessage,
  } = useMessageStore();

  const conversation = conversations.find(
    (item) => item.id === selectedConversation
  );

  const handleSend = async () => {
    if (
      !user ||
      !selectedConversation ||
      !conversation ||
      !text.trim()
    ) {
      return;
    }

    const receiverId =
      user._id === conversation.customerId
        ? conversation.vendor?.user?.id
        : conversation.customer?.id;

    if (!receiverId) {
      return;
    }

await sendNewMessage(
  selectedConversation,
  receiverId,
  text
);

    setText("");
  };

  return (
    <div className="flex shrink-0 items-center gap-3 border-t border-slate-200 bg-white p-5">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-gray-700 outline-none focus:border-rose-500"
      />

      <button
        onClick={handleSend}
        className="rounded-xl bg-rose-500 p-3 text-white transition hover:bg-rose-600"
      >
        <SendHorizonal size={20} />
      </button>
    </div>
  );
}
