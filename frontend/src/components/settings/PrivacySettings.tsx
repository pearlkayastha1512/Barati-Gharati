"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";

export default function PrivacySettings() {
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
    key: keyof typeof settings.privacy
  ) => {
    updateSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]:
          !settings.privacy[key],
      },
    });
  };

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-rose-500">
        Privacy
      </h2>

      <div className="mt-8 space-y-5">

        <ToggleRow
          title="Public Profile"
          checked={
            settings.privacy.publicProfile
          }
          onChange={() =>
            toggle("publicProfile")
          }
        />

        <ToggleRow
          title="Activity Status"
          checked={
            settings.privacy.activityStatus
          }
          onChange={() =>
            toggle("activityStatus")
          }
        />

        <ToggleRow
          title="Share Wedding Progress"
          checked={
            settings.privacy
              .shareWeddingProgress
          }
          onChange={() =>
            toggle(
              "shareWeddingProgress"
            )
          }
        />

        <ToggleRow
          title="Marketing Emails"
          checked={
            settings.privacy
              .marketingEmails
          }
          onChange={() =>
            toggle("marketingEmails")
          }
        />

      </div>

    </section>
  );
}

interface ToggleProps {
  title: string;

  checked: boolean;

  onChange: () => void;
}

function ToggleRow({
  title,
  checked,
  onChange,
}: ToggleProps) {
  return (
    <div className="flex items-center justify-between">

      <span className="font-medium text-gray-700">
        {title}
      </span>

      <button
        onClick={onChange}
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