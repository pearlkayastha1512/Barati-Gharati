// types/user.ts
export enum UserRole {
  USER = "USER",
  VENDOR = "VENDOR",
  ADMIN = "ADMIN",
}

export enum CustomerMembership {
  FREE = "FREE",
  PREMIUM = "PREMIUM",
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  adminRole?: string | null;
  permissions?: string[];
  mustChangePassword?: boolean;
  membership?: CustomerMembership; // NEW — comes straight from login/register response
}