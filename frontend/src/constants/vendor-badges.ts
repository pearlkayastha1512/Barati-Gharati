export type VendorBadge =
  | "bronze"
  | "silver"
  | "gold";

export const VENDOR_BADGE_LIMITS: Record<
  VendorBadge,
  number
> = {
  bronze: 5,
  silver: 15,
  gold: 50,
};

export const VENDOR_BADGE_LABELS: Record<
  VendorBadge,
  string
> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
};

export const VENDOR_BADGE_COLORS: Record<
  VendorBadge,
  string
> = {
  bronze: "bg-amber-100 text-amber-800",
  silver: "bg-slate-200 text-slate-800",
  gold: "bg-yellow-100 text-yellow-800",
};
