"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { changeOwnAdminPasswordApi } from "@/services/api/admin.api";
import { useAuthStore } from "@/store/authStore";

export default function ChangeAdminPasswordPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setSaving(true);
    const result = await changeOwnAdminPasswordApi(password);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? "Unable to change password.");
      return;
    }
    if (user) updateUser({ ...user, mustChangePassword: false });
    toast.success("Password changed successfully.");
    router.replace("/admin");
  };

  return (
    <div className="mx-auto max-w-xl py-12">
      <form onSubmit={submit} className="rounded-3xl border border-[#ffb3bf] bg-white p-8 shadow-xl">
        <div className="inline-flex rounded-2xl bg-[#ffe6eb] p-3 text-[#ff4d6d]"><KeyRound /></div>
        <h1 className="mt-5 text-3xl font-black text-[#3f1d2f]">Create Your Password</h1>
        <p className="mt-2 text-[#8d6171]">For security, replace the temporary password before using the admin dashboard.</p>
        <label className="mt-7 block text-sm font-bold text-[#6c2d45]">New password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required className="mt-2 w-full rounded-2xl border border-[#ffb3bf] px-4 py-3 outline-none" />
        </label>
        <label className="mt-4 block text-sm font-bold text-[#6c2d45]">Confirm password
          <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required className="mt-2 w-full rounded-2xl border border-[#ffb3bf] px-4 py-3 outline-none" />
        </label>
        <button disabled={saving} className="mt-7 w-full rounded-2xl bg-[#ff4d6d] py-3 font-bold text-white disabled:opacity-60">{saving ? "Saving…" : "Save Password & Continue"}</button>
      </form>
    </div>
  );
}
