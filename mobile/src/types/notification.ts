export enum NotificationType {
  BOOKING = "BOOKING",
  PAYMENT = "PAYMENT",
  SYSTEM = "SYSTEM",
}

export interface Notification {
  id: string;

  title: string;

  message: string;

  type: NotificationType;

  referenceId?: string;

  isRead: boolean;

  createdAt: string;
}