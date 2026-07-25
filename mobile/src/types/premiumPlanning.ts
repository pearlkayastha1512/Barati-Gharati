export enum PremiumPlanningStatus {
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  VENDORS_ASSIGNED = "VENDORS_ASSIGNED",
  QUOTED = "QUOTED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  BOOKED = "BOOKED",
}

export interface AssignedVendor {
  id: string;
  profileId: number | null;
  businessName: string;
  category: string;
  city: string;
  logoUrl?: string | null;
  coverImage?: string | null;
}

export interface PremiumPlanningRequest {
  id: string;
  userId: string;
  weddingType: string;
  venuePreference: string;
  budget: number;
  city: string;
  guestCount: number;
  theme: string;
  requiredVendors: string[];
  specialRequirements?: string | null;
  status: PremiumPlanningStatus;
  assignedVendorIds: string[];
  assignedVendors: AssignedVendor[]; // resolved vendor objects — only present from listMine()
  quotationAmount?: number | null;
  quotationDetails?: Record<string, unknown> | null;
  adminNotes?: string | null;
  reviewedAt?: string | null;
  quotedAt?: string | null;
  respondedAt?: string | null;
  bookedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePremiumPlanningRequestPayload {
  weddingType: string;
  venuePreference: string;
  budget: number;
  city: string;
  guestCount: number;
  theme: string;
  requiredVendors: string[];
  specialRequirements?: string;
}

// Every endpoint wraps its payload like this
export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}