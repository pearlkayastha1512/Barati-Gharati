"use client";

import { useMemo, useState } from "react";

import EmailHero from "@/components/admin/emails/EmailHero";
import EmailTable from "@/components/admin/emails/EmailTable";
import EmailDetailsModal from "@/components/admin/emails/EmailDetailsModal";

import { Email } from "@/types/email";
import { emailService } from "@/services/email.service";

export default function EmailsPage() {
  const emails = useMemo(
    () => emailService.getEmails(),
    []
  );

  const [selectedEmail, setSelectedEmail] =
    useState<Email | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const handleViewEmail = (
    email: Email
  ) => {
    setSelectedEmail(email);

    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <EmailHero />

      <EmailTable
        emails={emails}
        onView={handleViewEmail}
      />

      <EmailDetailsModal
        email={selectedEmail}
        open={isModalOpen}
        onClose={() => {
          setSelectedEmail(null);

          setIsModalOpen(false);
        }}
      />
    </div>
  );
}