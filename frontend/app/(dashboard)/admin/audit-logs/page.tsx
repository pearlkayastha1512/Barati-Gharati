"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { getAdminAuditLogsApi } from "@/services/api/admin.api";

type AuditLog = {
  id: string;
  action: string;
  resource: string;
  resourceId?: string | null;
  createdAt: string;
  actor: { name: string; email: string; adminRole: string | null };
};

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    void (async () => {
      const result = await getAdminAuditLogsApi();
      if (!result.ok) {
        toast.error(result.error ?? "Unable to load audit logs.");
        return;
      }
      const response = result.data as { data?: AuditLog[] };
      setLogs(Array.isArray(response?.data) ? response.data : []);
    })();
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-[#ff4d6d] to-[#ffb703] p-8 text-[#3f1d2f] shadow-xl">
        <ClipboardList size={30} />
        <h1 className="mt-4 text-4xl font-black">Admin Audit Logs</h1>
        <p className="mt-2 font-medium">Trace sensitive administrative actions and account-access changes.</p>
      </section>

      <section className="overflow-hidden rounded-3xl border border-[#ffb3bf] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#fff8f9] text-[#6c2d45]">
              <tr>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Resource</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-[#ffe0e5] text-[#5c3343]">
                  <td className="px-6 py-4">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4"><p className="font-bold">{log.actor.name}</p><p className="text-sm text-[#8d6171]">{log.actor.email}</p></td>
                  <td className="px-6 py-4 font-semibold">{log.action}</td>
                  <td className="px-6 py-4">{log.resource}{log.resourceId ? ` · ${log.resourceId}` : ""}</td>
                </tr>
              ))}
              {logs.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-[#8d6171]">No admin actions recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
