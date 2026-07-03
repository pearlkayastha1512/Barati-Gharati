import { VendorRegistrationForm } from "@/types/vendorRegistration";
import { User } from "@/types/auth";
import { VendorSettings } from "@/types/vendorSettings";
import { getUsers, saveUsers } from "./auth.service";

const STORAGE_KEY = "vendors";

export type StoredVendor = VendorRegistrationForm & {
  id: number;

  // Links Vendor <-> User
  userId: string;

  // Admin Approval
  isApproved: boolean;

  // Vendor can activate/deactivate business
  isActive: boolean;

  createdAt: string;

  updatedAt: string;

  settings: VendorSettings;
};

export function getVendors(): StoredVendor[] {
  if (typeof window === "undefined") {
    return [];
  }

  const vendors = localStorage.getItem(STORAGE_KEY);

  if (!vendors) {
    return [];
  }

  const parsedVendors: StoredVendor[] = JSON.parse(vendors);

  const updatedVendors = parsedVendors.map((vendor) => ({
    ...vendor,

    // Backward compatibility
    isActive: vendor.isActive ?? true,

    settings: vendor.settings ?? {
      business: {
        acceptNewBookings: true,
        displayPricingPublicly: false,
        showAvailabilityCalendar: true,
      },

      notifications: {
        newBookingNotifications: true,
        paymentAlerts: true,
        customerMessages: true,
        marketingEmails: false,
      },

      security: {
        loginAlerts: true,
        twoFactorAuthentication: false,
      },
    },
  }));

  // Update old vendors automatically
  saveVendors(updatedVendors);

  return updatedVendors;
}

export function saveVendors(
  vendors: StoredVendor[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(vendors)
  );
}

export function updateVendor(
  updatedVendor: StoredVendor
): void {
  const vendors = getVendors();

  const updated = vendors.map((vendor) =>
    vendor.id === updatedVendor.id
      ? {
          ...updatedVendor,
          updatedAt: new Date().toISOString(),
        }
      : vendor
  );

  saveVendors(updated);
}

export function getVendorByUserId(
  userId: string
): StoredVendor | undefined {
  return getVendors().find(
    (vendor) => vendor.userId === userId
  );
}

export function getVendorById(
  id: number
): StoredVendor | undefined {
  return getVendors().find(
    (vendor) => vendor.id === id
  );
}

export function registerVendor(
  data: VendorRegistrationForm
): {
  success: boolean;
  message: string;
  vendor?: StoredVendor;
} {
  const vendors = getVendors();
  const users = getUsers();

  // Global Email Check
  const existingUser = users.find(
    (user) =>
      user.email.toLowerCase() ===
      data.email.toLowerCase()
  );

  if (existingUser) {
    return {
      success: false,
      message: "Email already registered.",
    };
  }

  // Create User ID first so both records share it
  const userId = crypto.randomUUID();

  // Authentication User
  const newUser: User & { password: string } = {
    _id: userId,

    name: data.ownerName,

    email: data.email,

    phone: data.phone,

    password: data.password,

    avatar: "",

    role: "vendor",

    status: "pending",

    isVerified: false,

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);

  saveUsers(users);

  // Vendor Profile
  const newVendor: StoredVendor = {
    ...data,

    // Numeric Vendor ID
    id: Date.now(),

    // Link Vendor ↔ User
    userId,

    // Approval Status (Admin)
    isApproved: false,

    // Vendor Business Status
    isActive: true,

    // Vendor Settings
    settings: {
      business: {
        acceptNewBookings: true,
        displayPricingPublicly: false,
        showAvailabilityCalendar: true,
      },

      notifications: {
        newBookingNotifications: true,
        paymentAlerts: true,
        customerMessages: true,
        marketingEmails: false,
      },

      security: {
        loginAlerts: true,
        twoFactorAuthentication: false,
      },
    },

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  };

  vendors.push(newVendor);

  saveVendors(vendors);

  return {
    success: true,
    message: "Vendor registered successfully.",
    vendor: newVendor,
  };
}