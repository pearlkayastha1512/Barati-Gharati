import { VendorRegistrationForm } from "@/types/vendorRegistration";
import { VendorSettings } from "@/types/vendorSettings";
import { Vendor } from "@/types/vendor";

import {
  getVendorsApi,
  getVendorByIdApi,
} from "@/services/api/vendor.api";

import {
 
  getMyVendorProfileApi,
} from "@/services/api/vendor.api";

export interface StoredVendor {
  id: number;

  userId: string;

  businessName: string;

  description?: string;

  category: string;

  city: string;

  address?: string;

  profileImage?: string;

  coverImage?: string;

  portfolioImages: string[];

  website?: string;

  instagram?: string;

  facebook?: string;

  youtube?: string;

  linkedin?: string;

  experience?: string;

  gstNumber?: string;

  businessVerified: boolean;

  gstVerified: boolean;

  bankVerified: boolean;

  documentsUploaded: boolean;

  approvalStatus:
    | "pending"
    | "approved"
    | "rejected";

  isActive: boolean;

  createdAt: string;

  updatedAt: string;

  settings?: VendorSettings;
}

/**
 * Public vendors (Marketplace)
 */
export async function getVendors(): Promise<Vendor[]> {
  const result = await getVendorsApi();

  if (!result.ok || !result.data) {
    return [];
  }

  return result.data as Vendor[];
}

/**
 * Public vendor details
 */
export async function getVendorById(
  id: number
): Promise<Vendor | undefined> {
  const result = await getVendorByIdApi(id);

  if (!result.ok || !result.data) {
    return undefined;
  }

  return result.data as Vendor;
}

/**
 * Vendor dashboard profile
 */
// export async function getVendorByUserId(): Promise<StoredVendor | undefined> {
//   const result = await getMyVendorProfileApi();

//   if (!result.ok || !result.data) {
//     return undefined;
//   }

//   return result.data as StoredVendor;
// }











export async function getVendorByUserId(): Promise<StoredVendor | undefined> {
  const result = await getMyVendorProfileApi();

  if (!result.ok || !result.data) {
    return undefined;
  }

  const vendor = result.data;

  return {
    id: vendor.frontendVendorId,

    userId: vendor.userId,

    businessName: vendor.businessName,

    description: vendor.description ?? "",

    category: vendor.category ?? "",

    city: vendor.city ?? "",

    address: vendor.address ?? "",

    profileImage: vendor.logoUrl ?? "",

    coverImage: vendor.coverImage ?? "",

    portfolioImages: [],

    website: vendor.website ?? "",

    instagram: vendor.instagram ?? "",

    facebook: vendor.facebook ?? "",

    youtube: vendor.youtube ?? "",

    linkedin: vendor.linkedin ?? "",

    experience: vendor.experience ?? "",

    gstNumber: vendor.gstNumber ?? "",

    businessVerified: vendor.businessVerified,

    gstVerified: vendor.gstVerified,

    bankVerified: vendor.bankVerified,

    documentsUploaded: vendor.documentsUploaded,

    approvalStatus: vendor.status.toLowerCase(),

    isActive: vendor.isActive,

    createdAt: vendor.createdAt,

    updatedAt: vendor.updatedAt,
  };
}

/**
 * TODO
 * This will call PATCH /vendor/profile
 * after backend profile update API
 * is fully integrated.
 */
export async function updateVendor(
  updatedVendor: StoredVendor
): Promise<boolean> {
  console.warn(
    "updateVendor() not migrated yet.",
    updatedVendor
  );

  return true;
}

/**
 * No longer required.
 * Vendors are fetched from backend.
 */
export function saveVendors(): void {
  return;
}

/**
 * Vendor registration now happens through
 * POST /auth/register/vendor
 */
export function registerVendor(
  _data: VendorRegistrationForm
): never {
  throw new Error(
    "Vendor registration has been migrated to backend Auth API."
  );
}
