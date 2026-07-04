"use client";

import { Eye } from "lucide-react";

import { Email } from "@/types/email";

interface Props {
  emails: Email[];
  onView: (email: Email) => void;
}

export default function EmailTable({
  emails,
  onView,
}: Props) {
  if (emails.length === 0) {
    return (
      <section className="rounded-3xl border border-gray-200 bg-white p-20 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-gray-700">
          No Emails
        </h2>

        <p className="mt-3 text-gray-500">
          Emails will appear here automatically.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">
                Recipient
              </th>

              <th className="px-6 py-4 text-left font-semibold text-gray-700">
                Subject
              </th>

              <th className="px-6 py-4 text-left font-semibold text-gray-700">
                Status
              </th>

              <th className="px-6 py-4 text-left font-semibold text-gray-700">
                Date
              </th>

              <th className="px-6 py-4 text-left font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {emails.map((email) => (
              <tr
                key={email.id}
                className="border-t border-gray-200 transition-colors hover:bg-gray-50"
              >
                <td className="px-6 py-5 text-gray-700">
                  {email.to}
                </td>

                <td className="px-6 py-5 text-gray-700">
                  {email.subject}
                </td>

                <td className="px-6 py-5">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {email.status}
                  </span>
                </td>

                <td className="px-6 py-5 text-gray-600">
                  {new Date(email.createdAt).toLocaleString()}
                </td>

                <td className="px-6 py-5">
                  <button
                    onClick={() => onView(email)}
                    className="rounded-xl bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}