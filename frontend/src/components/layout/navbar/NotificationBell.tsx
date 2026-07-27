"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const { user } = useAuthStore();

  const {
    notifications,
    markAsRead,
    refreshNotifications,
  } = useNotificationStore();

  useEffect(() => {
    if (user) {
      refreshNotifications();
    }
  }, [refreshNotifications, user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const userNotifications = useMemo(() => {
    if (!user) {
      return [];
    }

    return notifications
      .filter(
        (notification) =>
          notification.userId === user._id
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
  }, [notifications, user]);

  if (!user) return null;

  const unreadCount = userNotifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* Bell */}

      {/* <button
        onClick={() => setOpen(!open)}
        className="
          relative
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-2xl
          transition-all
          duration-300
          hover:bg-rose-50
          hover:text-rose-500
        "
      >
        <Bell
          size={22}
          className="text-gray-700"
        />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-2
              -top-1
              z-20
              flex
              h-5
              min-w-[20px]
              items-center
              justify-center
              rounded-full
              border-2
              border-white
              bg-rose-500
              px-1
              text-[10px]
              font-bold
              leading-none
              text-white
              shadow
            "
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button> */}



      <button
  onClick={() => {
    const nextOpen = !open;

    setOpen(nextOpen);

    if (nextOpen) {
      refreshNotifications();
    }
  }}
  className="
    relative
    flex h-11 w-11
    items-center justify-center
    rounded-xl
    bg-rose-100
    border border-slate-200
    shadow-sm
    transition
    hover:shadow-md
    hover:bg-slate-50
  "
>
  <Bell
    size={20}
    className="text-slate-700"
  />

  {unreadCount > 0 && (
    <span
      className="
        absolute
        -top-1
        -right-1
        flex
        min-w-[18px]
        h-[18px]
        items-center
        justify-center
        rounded-full
       
        text-[10px]
        font-bold
        text-rose-700
        ring-2
        bg-white
        ring-white
      "
    >
      {unreadCount > 9 ? "9+" : unreadCount}
    </span>
  )}
</button>

      {/* Dropdown */}

      {open && (
        <div
          className="
            absolute
            right-0
            mt-4
            w-[380px]
            top-full
max-h-[520px]
z-[999]
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-2xl
            z-50
          "
        >
          {/* Header */}

          <div className="flex items-center justify-between border-b px-6 py-4">

            <h3 className="text-lg font-bold text-slate-900">
              Notifications
            </h3>

            {unreadCount > 0 && (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
                {unreadCount} New
              </span>
            )}

          </div>

          {/* Notifications */}

          <div
  className="
    max-h-[420px]
    overflow-y-auto
    overscroll-contain
    scrollbar-thin
    scrollbar-thumb-slate-300
    scrollbar-track-transparent
  "
>

            {userNotifications.length === 0 ? (
              <div className="py-14 text-center">

                <Bell
                  size={40}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-4 text-slate-500">
                  No notifications yet
                </p>

              </div>
            ) : (
              userNotifications.map(
                (notification) => (
                  <button
                    key={notification.id}
                    onClick={async () => {
                      await markAsRead(
                        notification.id
                      );

                      setOpen(false);

                      const roleBase =
                        user.role === "vendor"
                          ? "/vendor"
                          : user.role === "admin"
                          ? "/admin"
                          : "/customer";

                      const link =
                        notification.link
                          ? notification.link
                          : notification.type === "message"
                          ? `${roleBase}/messages`
                          : notification.type === "booking"
                          ? `${roleBase}/bookings`
                          : undefined;

                      if (link) {
                        router.push(link);
                      }
                    }}
                    className={`
                      w-full
                      border-b
                      px-6
                      py-4
                      text-left
                      transition-all
                      duration-200
                      hover:bg-slate-50
                      ${
                        !notification.isRead
                          ? "bg-rose-100"
                          : ""
                      }
                    `}
                  >
                    <div className="flex gap-3">

                      <div className="mt-2">
                        {!notification.isRead && (
                          <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                        )}
                      </div>

                      <div className="flex-1">

                        <h4 className="font-semibold text-slate-900">
                          {notification.title}
                        </h4>

                        <p className="mt-1 text-sm text-slate-600">
                          {notification.message}
                        </p>

                        <span className="mt-2 block text-xs text-slate-400">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </span>

                      </div>

                    </div>
                  </button>
                )
              )
            )}

          </div>
        </div>
      )}
    </div>
  );
}
