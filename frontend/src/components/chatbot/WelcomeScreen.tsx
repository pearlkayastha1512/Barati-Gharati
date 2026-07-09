"use client";

import {
  Search,
  CalendarDays,
  Wallet,
  PhoneCall,
  Sparkles,
} from "lucide-react";

import { useChatbotStore } from "@/store/chatbotStore";

import { sendChatMessage } from "@/services/chatbot.service";

const actions = [
  {
    title: "Find Vendors",
    description: "Search wedding professionals",
    icon: Search,
    message: "Help me find vendors",
  },
  {
    title: "Book a Vendor",
    description: "Know the booking process",
    icon: CalendarDays,
    message: "How can I book a vendor?",
  },
  {
    title: "Wedding Budget",
    description: "Manage your wedding expenses",
    icon: Wallet,
    message: "Help me plan my wedding budget",
  },
  {
    title: "Contact Support",
    description: "Talk to our support team",
    icon: PhoneCall,
    message: "I need customer support",
  },
];

export default function WelcomeScreen() {
  const addMessage = useChatbotStore((state) => state.addMessage);
  const setTyping = useChatbotStore((state) => state.setTyping);




const handleClick = async (message: string) => {
  addMessage({
    id: crypto.randomUUID(),
    sender: "user",
    text: message,
    createdAt: new Date().toISOString(),
  });

  setTyping(true);

  try {
    const response = await sendChatMessage(message);

    addMessage({
      id: crypto.randomUUID(),
      sender: "bot",
      text:
        response?.reply ??
        response?.message ??
        "Sorry, I couldn't generate a response.",
      createdAt: new Date().toISOString(),
    });
  } catch {
    addMessage({
      id: crypto.randomUUID(),
      sender: "bot",
      text:
        "Sorry, something went wrong.",
      createdAt: new Date().toISOString(),
    });
  } finally {
    setTyping(false);
  }
};











  return (
    <div
      className="
        flex
        h-full
        flex-col
        overflow-y-auto
        px-5
        py-4
      "
    >
      {/* Logo */}

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg">
        <Sparkles size={22} />
      </div>

      {/* Heading */}

      <h2 className="mt-3 text-center text-xl font-bold text-slate-900">
        Welcome 👋
      </h2>

      {/* Description */}

      <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-6 text-slate-500">
        I&apos;m your Barati Gharati AI Assistant.
        Ask me anything about vendors,
        bookings, wedding planning,
        payments or support.
      </p>

      {/* Quick Actions */}

      <div className="mt-5 grid gap-2">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => handleClick(item.message)}
              className="
                group
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-slate-200
                bg-white
                p-3
                text-left
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-rose-300
                hover:bg-rose-50
                hover:shadow-md
              "
            >
              <div className="rounded-xl bg-rose-100 p-2 transition-colors group-hover:bg-rose-500">
                <Icon
                  size={18}
                  className="text-rose-600 group-hover:text-white"
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}

      <p className="mt-4 text-center text-xs text-slate-400">
        Powered by Barati Gharati AI
      </p>
    </div>
  );
}
