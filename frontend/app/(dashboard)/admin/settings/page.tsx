"use client";

import SettingsHero from "@/components/admin/settings/SettingsHero";
import PlatformSettings from "@/components/admin/settings/PlatformSettings";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <SettingsHero />

      <PlatformSettings />
    </div>
  );
}