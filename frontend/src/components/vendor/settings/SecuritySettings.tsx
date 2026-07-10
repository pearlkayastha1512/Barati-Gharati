"use client";

import { useState } from "react";

import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";

import { changePassword } from "@/services/auth.service";

export default function SecuritySettings() {
  const { user } = useAuthStore();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSave = () => {
    if (!user) return;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      toast.error("Please fill all fields.");

      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "Password must be at least 6 characters."
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "Passwords do not match."
      );

      return;
    }

    setLoading(true);

    const result = changePassword(
      user._id,
      currentPassword,
      newPassword
    );

    if (!result.success) {
      toast.error(result.message);

      setLoading(false);

      return;
    }

    toast.success(result.message);

    setCurrentPassword("");

    setNewPassword("");

    setConfirmPassword("");

    setLoading(false);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-gray-800">
        Security
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Update your account password.
      </p>

      <div className="mt-8 space-y-5">

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(
              e.target.value
            )
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#e4005a] focus:ring-2 focus:ring-[#ffe1ec] text-gray-600"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(
              e.target.value
            )
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#e4005a] focus:ring-2 focus:ring-[#ffe1ec] text-gray-600"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#e4005a] focus:ring-2 focus:ring-[#ffe1ec] text-gray-600"
        />

      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-8 w-full rounded-2xl bg-[#e4005a] py-3 font-semibold text-white transition hover:bg-[#c8004e] disabled:opacity-60"
      >
        {loading
          ? "Updating..."
          : "Change Password"}
      </button>

    </section>
  );
}