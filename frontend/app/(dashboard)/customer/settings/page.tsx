import SettingsHero from "@/components/settings/SettingsHero";
import CustomerMembershipCard from "@/components/settings/CustomerMembershipCard";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import DangerZone from "@/components/settings/DangerZone";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <SettingsHero />

      <CustomerMembershipCard />

      <section className="grid gap-6 xl:grid-cols-2">
        <AccountSettings />
        <NotificationSettings />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <PrivacySettings />
        <SecuritySettings />
      </section>

      <DangerZone />
    </div>
  );
}