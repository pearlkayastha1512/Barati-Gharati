"use client";

import { useEffect, useState } from "react";

import {
  Lock,
  ShieldCheck,
  BellRing,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import { changePassword } from "@/services/auth.service";
import { toast } from "sonner";

export default function SecuritySettings() {
  const user = useAuthStore(
    (state) => state.user
  );

  const {
    settings,
    loadSettings,
    updateSettings,
  } = useSettingsStore();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings(user._id);
    }
  }, [user, loadSettings]);

  if (!user || !settings) {
    return null;
  }

  const toggle = (
    key: keyof typeof settings.security
  ) => {
    updateSettings({
      ...settings,

      security: {
        ...settings.security,

        [key]:
          !settings.security[key],
      },
    });
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setPasswordLoading(true);

    const result = await changePassword(
      user._id,
      currentPassword,
      newPassword
    );

    setPasswordLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false);
  };

  return (
    <section className="rounded-3xl border border-[#ffb3bf] bg-[#fffdf0] p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-[#ff4d6d]">
        Security
      </h2>

      <div className="mt-8 space-y-6">

        <ToggleCard
          icon={<ShieldCheck size={20} />}
          title="Two-Factor Authentication"
          description="Protect your account with an additional verification step."
          checked={
            settings.security.twoFactor
          }
          onToggle={() =>
            toggle("twoFactor")
          }
        />

        <ToggleCard
          icon={<BellRing size={20} />}
          title="Login Alerts"
          description="Receive notifications whenever someone logs into your account."
          checked={
            settings.security.loginAlerts
          }
          onToggle={() =>
            toggle("loginAlerts")
          }
        />

        <button
          type="button"
          onClick={() => setShowPasswordForm((visible) => !visible)}
          className="flex w-full items-center justify-between rounded-2xl border border-[#ffb3bf] p-4 text-left transition hover:bg-[#fff8d8]"
        >
          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-[#fff8d8] p-3 text-[#6c2d45]">

              <Lock size={20} />

            </div>

            <div className="text-left">

              <p className="font-semibold text-[#6c2d45]">
                Change Password
              </p>

              <p className="text-sm text-[#8d6171]">
                {showPasswordForm ? "Close password form" : "Update your password"}
              </p>

            </div>

          </div>

        </button>

        {showPasswordForm && (
          <div className="space-y-4 rounded-2xl border border-[#ffb3bf] p-4">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-gray-600 outline-none transition focus:border-[#ff4d6d] focus:ring-2 focus:ring-[#ffe1ec]"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-gray-600 outline-none transition focus:border-[#ff4d6d] focus:ring-2 focus:ring-[#ffe1ec]"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-gray-600 outline-none transition focus:border-[#ff4d6d] focus:ring-2 focus:ring-[#ffe1ec]"
            />
            <button
              type="button"
              onClick={handlePasswordChange}
              disabled={passwordLoading}
              className="w-full rounded-2xl bg-[#ff4d6d] py-3 font-semibold text-white transition hover:bg-[#e83f5e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {passwordLoading ? "Updating..." : "Change Password"}
            </button>
          </div>
        )}

      </div>

    </section>
  );
}

interface ToggleCardProps {
  icon: React.ReactNode;

  title: string;

  description: string;

  checked: boolean;

  onToggle: () => void;
}

function ToggleCard({
  icon,
  title,
  description,
  checked,
  onToggle,
}: ToggleCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#fff3b0] p-4">

      <div className="flex items-center gap-4">

        <div className="rounded-xl bg-[#fff8d8] p-3 text-[#6c2d45]">
          {icon}
        </div>

        <div>

          <p className="font-semibold text-[#3f1d2f]">
            {title}
          </p>

          <p className="text-sm text-[#8d6171]">
            {description}
          </p>

        </div>

      </div>

      <button
        onClick={onToggle}
        className={`relative h-7 w-12 rounded-full transition ${
          checked
            ? "bg-[#ff4d6d]"
            : "bg-[#ffb3bf]"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-[#fffdf0] transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}
