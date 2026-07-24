// "use client";

// import { MessageCircle } from "lucide-react";

// import { useAuthStore } from "@/store/authStore";
// import { useMessageStore } from "@/store/messageStore";

// export default function ChatWindow() {
//   const { user } = useAuthStore();

//   const {
//     messages,
//     conversations,
//     selectedConversation,
//   } = useMessageStore();

//   const conversation = conversations.find(
//     (item) => item.id === selectedConversation
//   );

//   if (!selectedConversation) {
//     return (
//       <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#fffdf0] to-[#ffe6eb]">
//         <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#ffe6eb]">
//           <MessageCircle
//             size={42}
//             className="text-[#ff4d6d]"
//           />
//         </div>

//         <h2 className="mt-6 text-3xl font-bold text-[#3f1d2f]">
//           Your Messages
//         </h2>

//         <p className="mt-3 text-center text-[#8d6171]">
//           Select a conversation to start chatting.
//         </p>
//       </div>
//     );
//   }

//   const otherUserName =
//     user?._id === conversation?.customerId
//       ? conversation?.vendor?.businessName ??
//         "Vendor"
//       : conversation?.customer?.name ??
//         "Customer";

//   return (
//     <div className="flex h-full min-h-0 flex-col">
//       {/* Header */}

//       <div className="flex shrink-0 items-center justify-between border-b border-[#ffb3bf] bg-[#fffdf0] px-8 py-6">
//         <div className="flex items-center gap-4">
//           <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ffe6eb] to-[#fff8d8]">
//             <MessageCircle
//               size={24}
//               className="text-[#ff4d6d]"
//             />
//           </div>

//           <div>
//             <h2 className="text-xl font-bold text-[#3f1d2f]">
//               {otherUserName}
//             </h2>

//             <p className="text-sm text-[#ff4d6d]">
//               ● Online
//             </p>
//           </div>
//         </div>

//         {/* <div className="flex gap-3">
//           <button className="rounded-full bg-[#ffe6eb] p-3 transition hover:bg-[#ffe6eb]">
//             <Phone
//               size={18}
//               className="text-[#6c2d45]"
//             />
//           </button>

//           <button className="rounded-full bg-[#ffe6eb] p-3 transition hover:bg-[#ffe6eb]">
//             <Video
//               size={18}
//               className="text-[#6c2d45]"
//             />
//           </button>
//         </div> */}
//       </div>

//       {/* Chat Area */}

//       <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto bg-gradient-to-br from-[#fffdf0] via-[#ffe6eb] to-[#fff8d8] p-8">
//         <div className="mb-8 flex justify-center">
//           <span className="rounded-full bg-[#fffdf0] px-5 py-2 text-xs font-semibold text-[#8d6171] shadow">
//             Today
//           </span>
//         </div>

//         <div className="space-y-5">
//           {messages.map((message) => {
//             const mine =
//               message.senderId === user?._id;

//             return (
//               <div
//                 key={message.id}
//                 className={`flex ${
//                   mine
//                     ? "justify-end"
//                     : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`max-w-[70%] rounded-[28px] px-6 py-4 shadow-md ${
//                     mine
//                       ? "bg-gradient-to-r from-[#ff4d6d] to-[#ff8fa1] text-white"
//                       : "border border-[#ffb3bf] bg-[#fffdf0] text-[#6c2d45]"
//                   }`}
//                 >
//                   <p className="whitespace-pre-wrap break-words leading-7">
//                     {message.message}
//                   </p>

//                   <p
//                     className={`mt-2 text-right text-xs ${
//                       mine
//                         ? "text-[#111111]"
//                         : "text-[#ff8fa1]"
//                     }`}
//                   >
//                     {new Date(
//                       message.createdAt
//                     ).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";

import { MessageCircle } from "lucide-react";

import { toast } from "sonner";

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

  useEffect(() => {
    if (!selectedConversation) return;

    toast.warning(
      "⚠️ Do not share phone numbers, emails, social media accounts, UPI IDs, or any personal information. Violations may lead to temporary chat restrictions.",
      {
        id: "chat-warning",
        duration: 7000,
      }
    );
  }, [selectedConversation]);

  if (!selectedConversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#fffdf0] to-[#ffe6eb]">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#ffe6eb]">
          <MessageCircle
            size={42}
            className="text-[#ff4d6d]"
          />
        </div>

        <h2 className="mt-6 text-3xl font-bold text-[#3f1d2f]">
          Your Messages
        </h2>

        <p className="mt-3 text-center text-[#8d6171]">
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

      <div className="flex shrink-0 items-center justify-between border-b border-[#ffb3bf] bg-[#fffdf0] px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ffe6eb] to-[#fff8d8]">
            <MessageCircle
              size={24}
              className="text-[#ff4d6d]"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#3f1d2f]">
              {otherUserName}
            </h2>

            <p className="text-sm text-[#ff4d6d]">
              ● Online
            </p>
          </div>
        </div>

        {/* <div className="flex gap-3">
          <button className="rounded-full bg-[#ffe6eb] p-3 transition hover:bg-[#ffe6eb]">
            <Phone
              size={18}
              className="text-[#6c2d45]"
            />
          </button>

          <button className="rounded-full bg-[#ffe6eb] p-3 transition hover:bg-[#ffe6eb]">
            <Video
              size={18}
              className="text-[#6c2d45]"
            />
          </button>
        </div> */}
      </div>

      {/* Warning Banner */}

      <div className="border-b border-amber-200 bg-amber-50 px-6 py-3">
        <p className="text-center text-sm font-medium text-amber-700">
          ⚠️ Do not share phone numbers, emails,
          social media accounts, payment details,
          or any personal information. Violations
          may lead to temporary chat restrictions.
        </p>
      </div>

      {/* Chat Area */}

      <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto bg-gradient-to-br from-[#fffdf0] via-[#ffe6eb] to-[#fff8d8] p-8">
        <div className="mb-8 flex justify-center">
          <span className="rounded-full bg-[#fffdf0] px-5 py-2 text-xs font-semibold text-[#8d6171] shadow">
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
                      ? "bg-gradient-to-r from-[#ff4d6d] to-[#ff8fa1] text-white"
                      : "border border-[#ffb3bf] bg-[#fffdf0] text-[#6c2d45]"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words leading-7">
                    {message.message}
                  </p>

                  <p
                    className={`mt-2 text-right text-xs ${
                      mine
                        ? "text-[#111111]"
                        : "text-[#ff8fa1]"
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