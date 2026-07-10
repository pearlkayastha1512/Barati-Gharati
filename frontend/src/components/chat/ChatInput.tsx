// "use client";

// import { useState } from "react";
// import { SendHorizonal } from "lucide-react";

// import { useAuthStore } from "@/store/authStore";
// import { useMessageStore } from "@/store/messageStore";

// export default function ChatInput() {
//   const [text, setText] = useState("");

//   const { user } = useAuthStore();

//   const {
//     selectedConversation,
//     sendMessage,
//   } = useMessageStore();

//   const handleSend = () => {
//     if (
//       !user ||
//       !selectedConversation ||
//       !text.trim()
//     ) {
//       return;
//     }

//     sendMessage({
//       id: crypto.randomUUID(),

//       senderId: user._id,

//       senderName: user.name,

//       receiverId: selectedConversation,

//       receiverName: "",

//       message: text,

//      sentAt: new Date().toISOString(),

// status: "sent",
//     });

//     setText("");
//   };

//   return (
//     <div className="flex items-center gap-3 border-t border-[#ffb3bf] p-5">

//       <input
//         value={text}
//         onChange={(e) =>
//           setText(e.target.value)
//         }
//         placeholder="Type a message..."
//         className="flex-1 rounded-xl border border-[#ffb3bf] px-4 py-3 outline-none focus:border-[#ff4d6d] text-[#6c2d45]"
//       />

//       <button
//         onClick={handleSend}
//         className="rounded-xl bg-[#ff4d6d] p-3 text-white transition hover:bg-[#e63b5f]"
//       >
//         <SendHorizonal size={20} />
//       </button>

//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { SendHorizonal } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useMessageStore } from "@/store/messageStore";

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
    <div className="flex shrink-0 items-center gap-3 border-t border-[#ffb3bf] bg-[#fffdf0] p-5">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-xl border border-[#ffb3bf] px-4 py-3 text-[#6c2d45] outline-none focus:border-[#ff4d6d]"
      />

      <button
        onClick={handleSend}
        className="rounded-xl bg-[#ff4d6d] p-3 text-white transition hover:bg-[#e63b5f]"
      >
        <SendHorizonal size={20} />
      </button>
    </div>
  );
}
