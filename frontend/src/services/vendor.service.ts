import { VendorRegistrationForm } from "@/types/vendorRegistration";
import { User } from "@/types/auth";
import { VendorSettings } from "@/types/vendorSettings";
import { getUsers, saveUsers } from "./auth.service";

const STORAGE_KEY = "vendors";
import { emailService } from "./email.service";

export type StoredVendor = VendorRegistrationForm & {
  id: number;

  // Links Vendor <-> User
  userId: string;

  // Admin Approval
  approvalStatus:
    | "pending"
    | "approved"
    | "rejected";

  // Vendor can activate/deactivate business
  isActive: boolean;

  createdAt: string;

  updatedAt: string;

  settings: VendorSettings;
};

// export function getVendors(): StoredVendor[] {
//   if (typeof window === "undefined") {
//     return [];
//   }

//   const vendors = localStorage.getItem(STORAGE_KEY);

//   if (!vendors) {
//     return [];
//   }

//   const parsedVendors = JSON.parse(vendors);

//   const updatedVendors: StoredVendor[] =
//     parsedVendors.map((vendor: any) => ({
//       ...vendor,

//       // Backward Compatibility
//       isActive: vendor.isActive ?? true,

//       approvalStatus:
//         vendor.approvalStatus ??
//         (vendor.isApproved
//           ? "approved"
//           : "pending"),

//       settings: vendor.settings ?? {
//         business: {
//           acceptNewBookings: true,
//           displayPricingPublicly: false,
//           showAvailabilityCalendar: true,
//         },

//         notifications: {
//           newBookingNotifications: true,
//           paymentAlerts: true,
//           customerMessages: true,
//           marketingEmails: false,
//         },

//         security: {
//           loginAlerts: true,
//           twoFactorAuthentication: false,
//         },
//       },
//     }));

//   // Automatically migrate old vendors
//   saveVendors(updatedVendors);

//   return updatedVendors;
// }

export function getVendors(): StoredVendor[] {
  if (typeof window === "undefined") {
    return [];
  }

  const vendors = localStorage.getItem(STORAGE_KEY);

  if (!vendors) {
    return [];
  }

  const parsedVendors = JSON.parse(vendors);

  const updatedVendors: StoredVendor[] = parsedVendors.map(
    (vendor: any) => ({
      ...vendor,

      // Approval Migration
      approvalStatus:
        vendor.approvalStatus ??
        (vendor.isApproved
          ? "approved"
          : "pending"),

      // Status
      isActive: vendor.isActive ?? true,

      // Business Profile
      website: vendor.website ?? "",

      instagram: vendor.instagram ?? "",

      facebook: vendor.facebook ?? "",

      youtube: vendor.youtube ?? "",

      linkedin: vendor.linkedin ?? "",

      experience: vendor.experience ?? "",

      gstNumber: vendor.gstNumber ?? "",

      // Images
      profileImage:
        vendor.profileImage ?? "",

      coverImage:
        vendor.coverImage ?? "",

      portfolioImages:
        vendor.portfolioImages ?? [],

      // Verification
      businessVerified:
        vendor.businessVerified ?? false,

      gstVerified:
        vendor.gstVerified ?? false,

      bankVerified:
        vendor.bankVerified ?? false,

      documentsUploaded:
        vendor.documentsUploaded ?? false,

      // Settings
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
    })
  );

  // Auto-migrate existing vendors
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
  console.log("Incoming vendor:", updatedVendor);

  const vendors = getVendors();

  const updated = vendors.map((vendor) =>
    vendor.id === updatedVendor.id
      ? {
          ...updatedVendor,
          updatedAt: new Date().toISOString(),
        }
      : vendor
  );

  console.log("Saving vendors:", updated);

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

  // Shared User ID
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

    id: Date.now(),

    userId,

    approvalStatus: "pending",

    isActive: true,

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

  emailService.sendEmail(
  newUser.email,
  "Vendor Registration",
  `
Hi ${newUser.name},

Thank you for registering.

Your account is under review.

We'll notify you once approved.
`
);

  return {
    success: true,
    message: "Vendor registered successfully.",
    vendor: newVendor,
  };
}