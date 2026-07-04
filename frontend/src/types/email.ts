export interface Email {
  id: string;

  to: string;

  subject: string;

  message: string;

  status: "sent";

  createdAt: string;
}