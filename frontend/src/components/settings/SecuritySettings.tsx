"use client";

import { useEffect } from "react";

import {
  Lock,
  ShieldCheck,
  BellRing,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";

export default function SecuritySettings() {
  const user = useAuthStore(
    (state) => state.user
  );

  const {
    settings,
    loadSettings,
    updateSettings,
  } = useSettingsStore();

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

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-rose-500">
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
          disabled
          className="
            flex
            w-full
            items-center
            justify-between
            rounded-2xl
            border
            border-gray-200
            p-4
            opacity-60
            cursor-not-allowed
          "
        >
          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-gray-100 p-3 color-gray-700">

              <Lock size={20}  className="color-gray-700"/>

            </div>

            <div className="text-left">

              <p className="font-semibold text-gray-700">
                Change Password
              </p>

              <p className="text-sm text-gray-500">
                Coming soon
              </p>

            </div>

          </div>

        </button>

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
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">

      <div className="flex items-center gap-4">

        <div className="rounded-xl bg-gray-100 p-3 text-gray-700">
          {icon}
        </div>

        <div>

          <p className="font-semibold text-gray-900">
            {title}
          </p>

          <p className="text-sm text-gray-500">
            {description}
          </p>

        </div>

      </div>

      <button
        onClick={onToggle}
        className={`relative h-7 w-12 rounded-full transition ${
          checked
            ? "bg-rose-500"
            : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}