import { Email } from "@/types/email";

const STORAGE_KEY = "emails";

class EmailService {
  getEmails(): Email[] {
    if (typeof window === "undefined") {
      return [];
    }

    const emails =
      localStorage.getItem(STORAGE_KEY);

    if (!emails) {
      return [];
    }

    return JSON.parse(emails);
  }

  private saveEmails(
    emails: Email[]
  ) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(emails)
    );
  }

  sendEmail(
    to: string,
    subject: string,
    message: string
  ) {
    const emails =
      this.getEmails();

    const email: Email = {
      id: crypto.randomUUID(),

      to,

      subject,

      message,

      status: "sent",

      createdAt:
        new Date().toISOString(),
    };

    emails.unshift(email);

    this.saveEmails(emails);

    return {
      success: true,

      message:
        "Email sent successfully.",
    };
  }
}

export const emailService =
  new EmailService();