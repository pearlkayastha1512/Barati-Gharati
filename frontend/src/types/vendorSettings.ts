export interface VendorBusinessSettings {
  acceptNewBookings: boolean;

  displayPricingPublicly: boolean;

  showAvailabilityCalendar: boolean;
}

export interface VendorNotificationSettings {
  newBookingNotifications: boolean;

  paymentAlerts: boolean;

  customerMessages: boolean;

  marketingEmails: boolean;
}

export interface VendorSecuritySettings {
  loginAlerts: boolean;

  twoFactorAuthentication: boolean;
}

export interface VendorSettings {
  business: VendorBusinessSettings;

  notifications: VendorNotificationSettings;

  security: VendorSecuritySettings;
}