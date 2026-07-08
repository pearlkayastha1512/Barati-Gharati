// // import ConversationList from "@/components/messages/ConversationList";
// // import ChatHeader from "@/components/messages/ChatHeader";
// // import ChatMessages from "@/components/messages/ChatMessages";
// // import ChatInput from "@/components/messages/ChatInput";

// // export default function MessagesPage() {
// //   return (
// //     <div className="grid h-[calc(100vh-180px)] gap-6 xl:grid-cols-[380px_1fr]">

// //       <ConversationList />

// //       <div className="flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

// //         <ChatHeader />

// //         <ChatMessages />

// //         <ChatInput />

// //       </div>

// //     </div>
// //   );
// // }



// "use client";

// import ChatInput from "@/components/chat/ChatInput";
// import ChatList from "@/components/chat/ChatList";
// import ChatWindow from "@/components/chat/ChatWindow";

// export default function CustomerMessagesPage() {
//   return (
//    <main className="h-[calc(100vh-120px)] p-6">

//   <div className="mb-8">
//     <h1 className="text-5xl font-bold text-slate-900">
//       Messages
//     </h1>

//     <p className="mt-2 text-lg text-slate-500">
//       Chat with your vendors.
//     </p>
//   </div>

//   <section className="grid h-[82vh] grid-cols-[360px_1fr] gap-6">

//     <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

//       <ChatList />

//     </div>

//     <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

//       <ChatWindow />

//       <ChatInput />

//     </div>

//   </section>

// </main>
//   );
// }
"use client";

import { useEffect } from "react";

import ChatInput from "@/components/chat/ChatInput";
import ChatList from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";

import { useMessageStore } from "@/store/messageStore";

export default function CustomerMessagesPage() {
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
    <main className="flex h-[calc(100vh-9rem)] min-h-0 flex-col overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold text-slate-900">
            Messages
          </h1>

          <p className="mt-2 text-lg text-slate-500">
            Stay connected with your wedding vendors.
          </p>

        </div>

        <div className="rounded-2xl border border-rose-100 bg-white px-6 py-4 shadow-sm">

          <p className="text-sm text-slate-500">
            Active Conversations
          </p>

          <h2 className="mt-1 text-3xl font-bold text-rose-500">
            Live
          </h2>

        </div>

      </div>

      {/* Chat Container */}

      <section
        className="
          grid
          min-h-0
          flex-1
          grid-cols-[360px_1fr]
          overflow-hidden
          rounded-[32px]
          border
          border-slate-200
          bg-white
          shadow-2xl
        "
      >

        {/* Sidebar */}

        <aside className="min-h-0 border-r border-slate-200 bg-slate-50">

          <ChatList />

        </aside>

        {/* Chat */}

        <div className="flex min-h-0 flex-col">

          <div className="min-h-0 flex-1 overflow-hidden">

            <ChatWindow />

          </div>

          <ChatInput />

        </div>

      </section>

    </main>
  );
}
