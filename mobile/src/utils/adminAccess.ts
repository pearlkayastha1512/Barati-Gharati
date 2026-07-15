import type { User } from "../types/user";

export const hasAdminPermission = (
  user: User | null,
  permission: string,
) => {
  if (!user || user.role !== "ADMIN") {
    return false;
  }

  // Existing admin sessions created before RBAC are treated as Super Admin.
  if (!Array.isArray(user.permissions)) {
    return true;
  }

  return user.permissions.includes(permission);
};

export const getAdminRoleLabel = (role?: string | null) => {
  if (!role) return "Super Admin";

  return role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .replace("Review Dispute", "Review & Dispute");
};

