export interface NotificationSettings {
  email: boolean;

  bookingUpdates: boolean;

  vendorMessages: boolean;

  offers: boolean;
}

export interface PrivacySettings {
  publicProfile: boolean;

  activityStatus: boolean;

  shareWeddingProgress: boolean;

  marketingEmails: boolean;
}

export interface SecuritySettings {
  twoFactor: boolean;

  loginAlerts: boolean;
}

export interface AppSettings {
  customerId: string;

  notifications: NotificationSettings;

  privacy: PrivacySettings;

  security: SecuritySettings;
}