export enum UserRole {
  USER = "USER",
  VENDOR = "VENDOR",
  ADMIN = "ADMIN",
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
}