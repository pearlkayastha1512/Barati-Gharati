import { VendorRegistrationForm } from "@/types/vendorRegistration";
import { User } from "@/types/auth";
import { getUsers, saveUsers } from "./auth.service";

const STORAGE_KEY = "vendors";

export type StoredVendor = VendorRegistrationForm & {
  id: number;

  // Links Vendor <-> User
  userId: string;

  isApproved: boolean;

  createdAt: string;

  updatedAt: string;
};

export function getVendors(): StoredVendor[] {
  if (typeof window === "undefined") {
    return [];
  }

  const vendors = localStorage.getItem(STORAGE_KEY);

  if (!vendors) {
    return [];
  }

  return JSON.parse(vendors);
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

    // Numeric vendor id for bookings
    id: Date.now(),

    // Link vendor to authenticated user
    userId,

    isApproved: false,

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