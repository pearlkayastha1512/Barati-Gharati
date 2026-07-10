"use client";

import { MessageCircle } from "lucide-react";

interface ConversationCardProps {
  name: string;
  lastMessage: string;
  time?: string;
  active?: boolean;
  onClick: () => void;
}

export default function ConversationCard({
  name,
  lastMessage,
  time,
  active,
  onClick,
}: ConversationCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group
        w-full
        rounded-3xl
        border
        px-5
        py-4
        text-left
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        ${
          active
            ? "border-[#ff8fa1] bg-gradient-to-r from-[#ffe6eb] to-[#fff8d8]"
            : "border-[#ffb3bf] bg-[#fffdf0] hover:border-[#ff8fa1]"
        }
      `}
    >
      <div className="flex items-center gap-4">

        {/* Avatar */}

        <div
          className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-[#ffe6eb]
            to-[#fff8d8]
          "
        >
          <MessageCircle
            size={24}
            className="text-[#ff4d6d]"
          />
        </div>

        {/* Content */}

        <div className="min-w-0 flex-1">

          <div className="flex items-center justify-between">

            <h3 className="truncate text-lg font-bold text-[#3f1d2f]">
              {name}
            </h3>

            {time && (
              <span className="ml-3 text-xs text-[#ff8fa1]">
                {new Date(time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}

          </div>

          <p className="mt-1 truncate text-sm text-[#8d6171]">
            {lastMessage}
          </p>

        </div>

      </div>
    </button>
  );
}