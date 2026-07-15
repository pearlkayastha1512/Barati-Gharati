"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getPlatformSettingsApi,
  updatePlatformSettingsApi,
} from "@/services/api/admin.api";
import { useAuthStore } from "@/store/authStore";
import { hasAdminPermission } from "@/lib/adminAccess";

type PlatformSettingsState = {
  allowVendorRegistration: boolean;
  allowCustomerRegistration: boolean;
  enableReviews: boolean;
  enablePayments: boolean;
  maintenanceMode: boolean;
};

const defaultSettings: PlatformSettingsState = {
  allowVendorRegistration: true,
  allowCustomerRegistration: true,
  enableReviews: true,
  enablePayments: true,
  maintenanceMode: false,
};

const PLATFORM_SETTINGS_KEY =
  "admin_platform_settings";

type ApiSettingsResponse = {
  data?: Partial<PlatformSettingsState>;
};

function getStoredSettings() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const raw = localStorage.getItem(
    PLATFORM_SETTINGS_KEY
  );

  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(
      raw
    ) as Partial<PlatformSettingsState>;
  } catch {
    return undefined;
  }
}

function saveStoredSettings(
  settings: PlatformSettingsState
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    PLATFORM_SETTINGS_KEY,
    JSON.stringify(settings)
  );
}

export default function PlatformSettings() {
  const user = useAuthStore((state) => state.user);
  const canEdit = hasAdminPermission(user, "settings.manage");
  const [settings, setSettings] =
    useState<PlatformSettingsState>(
      defaultSettings
    );

  useEffect(() => {
    async function loadSettings() {
      const storedSettings =
        getStoredSettings();

      if (storedSettings) {
        setSettings({
          ...defaultSettings,
          ...storedSettings,
        });
      }

      const result =
        await getPlatformSettingsApi();

      if (!result.ok) {
        return;
      }

      const data =
        (result.data as ApiSettingsResponse)
          ?.data ?? {};

      const nextSettings = {
        ...defaultSettings,
        ...data,
      };

      setSettings(nextSettings);
      saveStoredSettings(nextSettings);
    }

    void loadSettings();
  }, []);

  const toggleSetting = async (
    key: keyof PlatformSettingsState
  ) => {
    if (!canEdit) return;
    const nextSettings = {
      ...settings,
      [key]: !settings[key],
    };

    setSettings(nextSettings);
    saveStoredSettings(nextSettings);

    const result =
      await updatePlatformSettingsApi({
        [key]: nextSettings[key],
      });

    if (!result.ok) {
      toast.success(
        "Saved locally. Run database migration to save on backend."
      );
      return;
    }

    const data =
      (result.data as ApiSettingsResponse)
        ?.data ?? {};

    const savedSettings = {
      ...defaultSettings,
      ...data,
    };

    setSettings(savedSettings);
    saveStoredSettings(savedSettings);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        Platform Settings
      </h2>

      <div className="mt-8 space-y-6">

        <Setting
          title="Allow Vendor Registration"
          checked={
            settings.allowVendorRegistration
          }
          onChange={() =>
            void toggleSetting(
              "allowVendorRegistration"
            )
          }
          disabled={!canEdit}
        />

        <Setting
          title="Allow Customer Registration"
          checked={
            settings.allowCustomerRegistration
          }
          onChange={() =>
            void toggleSetting(
              "allowCustomerRegistration"
            )
          }
          disabled={!canEdit}
        />

        <Setting
          title="Enable Reviews"
          checked={settings.enableReviews}
          onChange={() =>
            void toggleSetting("enableReviews")
          }
          disabled={!canEdit}
        />

        <Setting
          title="Enable Payments"
          checked={settings.enablePayments}
          onChange={() =>
            void toggleSetting("enablePayments")
          }
          disabled={!canEdit}
        />

        <Setting
          title="Maintenance Mode"
          checked={settings.maintenanceMode}
          onChange={() =>
            void toggleSetting(
              "maintenanceMode"
            )
          }
          disabled={!canEdit}
        />

      </div>

    </section>
  );
}

function Setting({
  title,
  checked = false,
  onChange,
  disabled = false,
}: {
  title: string;
  checked?: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-5">

      <h3 className="font-medium text-slate-700">
        {title}
      </h3>

      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-5 w-5 disabled:cursor-not-allowed disabled:opacity-50"
      />

    </div>
  );
}
