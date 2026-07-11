"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ElementType } from "react";
import {
  Ban,
  Clock,
  RotateCcw,
  ShieldAlert,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

import {
  blockChatUserApi,
  ChatModerationStatus,
  ChatModerationUser,
  getChatModerationUsersApi,
  muteChatUserApi,
  resetChatWarningsApi,
  suspendChatUserApi,
} from "@/services/api/admin.api";

type ApiModerationResponse = {
  data?: ChatModerationUser[];
};

const statusStyles: Record<
  ChatModerationStatus,
  string
> = {
  active: "bg-green-100 text-green-700",
  muted: "bg-orange-100 text-orange-700",
  blocked: "bg-red-100 text-red-700",
  suspended: "bg-slate-200 text-slate-800",
  flagged: "bg-rose-100 text-rose-700",
};

const statusLabel: Record<
  ChatModerationStatus,
  string
> = {
  active: "Active",
  muted: "Muted",
  blocked: "Blocked",
  suspended: "Suspended",
  flagged: "Flagged",
};

export default function ChatModerationPage() {
  const [users, setUsers] = useState<
    ChatModerationUser[]
  >([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);

    const result =
      await getChatModerationUsersApi();

    setLoading(false);

    if (!result.ok) {
      toast.error(
        result.error ??
          "Unable to load flagged users."
      );
      setUsers([]);
      return;
    }

    setUsers(
      ((result.data as ApiModerationResponse)
        ?.data ?? []) as ChatModerationUser[]
    );
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();

    return users.filter(
      (user) =>
        user.name
          .toLowerCase()
          .includes(term) ||
        user.email
          .toLowerCase()
          .includes(term) ||
        user.phone.includes(search) ||
        user.role.includes(term) ||
        user.status.includes(term)
    );
  }, [search, users]);

  const runAction = async (
    action: () => Promise<{
      ok: boolean;
      error?: string;
    }>,
    successMessage: string
  ) => {
    const result = await action();

    if (!result.ok) {
      toast.error(
        result.error ??
          "Unable to complete action."
      );
      return;
    }

    toast.success(successMessage);
    await loadUsers();
  };

  const confirmAndRun = async (
    message: string,
    action: () => Promise<{
      ok: boolean;
      error?: string;
    }>,
    successMessage: string
  ) => {
    if (!window.confirm(message)) {
      return;
    }

    await runAction(action, successMessage);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-[#3f1d2f] via-[#6c2d45] to-[#e4005a] p-8 text-white shadow-xl shadow-rose-200">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <h1 className="text-4xl font-bold">
              Chat Moderation
            </h1>
            <p className="mt-2 text-rose-100">
              Review flagged users and control chat access.
            </p>
          </div>

          <div className="rounded-2xl bg-white/15 p-4">
            <ShieldAlert size={32} />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search user, email, phone, role or status..."
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none transition focus:border-[#ff4d6d]"
        />
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="text-left">
                <th className="px-5 py-4 font-semibold text-slate-700">
                  User
                </th>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  Role
                </th>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  Warnings
                </th>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  Last Violation
                </th>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  Reason
                </th>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="text-slate-600">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center text-slate-500"
                  >
                    Loading moderation queue...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center text-slate-500"
                  >
                    No flagged or moderated users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-5">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {user.email}
                        </p>
                        <p className="text-sm text-slate-500">
                          {user.phone || "-"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-5 capitalize">
                      {user.role}
                    </td>

                    <td className="px-5 py-5 font-semibold">
                      {user.warningCount}
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[user.status]}`}
                      >
                        {statusLabel[user.status]}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      {user.lastViolationTime
                        ? new Date(
                            user.lastViolationTime
                          ).toLocaleString()
                        : "-"}
                    </td>

                    <td className="max-w-xs px-5 py-5">
                      <p className="line-clamp-2">
                        {user.violationReason || "-"}
                      </p>
                      {user.chatMutedUntil &&
                        user.status === "muted" && (
                          <p className="mt-1 text-xs text-orange-700">
                            Muted until{" "}
                            {new Date(
                              user.chatMutedUntil
                            ).toLocaleString()}
                          </p>
                        )}
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex min-w-[360px] flex-wrap gap-2">
                        <ActionButton
                          label="30 min"
                          icon={Clock}
                          onClick={() =>
                            runAction(
                              () =>
                                muteChatUserApi(
                                  user.id,
                                  30
                                ),
                              "User muted for 30 minutes."
                            )
                          }
                        />
                        <ActionButton
                          label="24 hrs"
                          icon={Clock}
                          onClick={() =>
                            runAction(
                              () =>
                                muteChatUserApi(
                                  user.id,
                                  24 * 60
                                ),
                              "User muted for 24 hours."
                            )
                          }
                        />
                        <ActionButton
                          label="7 days"
                          icon={Clock}
                          onClick={() =>
                            runAction(
                              () =>
                                muteChatUserApi(
                                  user.id,
                                  7 * 24 * 60
                                ),
                              "User muted for 7 days."
                            )
                          }
                        />
                        <ActionButton
                          label="Block"
                          icon={Ban}
                          tone="danger"
                          onClick={() =>
                            confirmAndRun(
                              `Block chat permanently for ${user.name}?`,
                              () =>
                                blockChatUserApi(
                                  user.id
                                ),
                              "Chat permanently blocked."
                            )
                          }
                        />
                        <ActionButton
                          label="Suspend"
                          icon={UserX}
                          tone="dark"
                          onClick={() =>
                            confirmAndRun(
                              `Suspend ${user.name}'s account? They will not be able to log in.`,
                              () =>
                                suspendChatUserApi(
                                  user.id
                                ),
                              "Account suspended."
                            )
                          }
                        />
                        <ActionButton
                          label="Reset"
                          icon={RotateCcw}
                          tone="neutral"
                          onClick={() =>
                            runAction(
                              () =>
                                resetChatWarningsApi(
                                  user.id
                                ),
                              "Warnings reset."
                            )
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  tone = "rose",
  onClick,
}: {
  label: string;
  icon: ElementType;
  tone?: "rose" | "danger" | "dark" | "neutral";
  onClick: () => void;
}) {
  const classes = {
    rose: "bg-rose-50 text-[#e4005a] hover:bg-rose-100",
    danger: "bg-red-50 text-red-700 hover:bg-red-100",
    dark: "bg-slate-800 text-white hover:bg-slate-700",
    neutral:
      "bg-slate-100 text-slate-700 hover:bg-slate-200",
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${classes[tone]}`}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}
