import type { User } from '@/types/auth';

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'FINANCE_ADMIN'
  | 'VENDOR_MANAGER'
  | 'BOOKING_MANAGER'
  | 'PREMIUM_PLANNING_MANAGER'
  | 'SUPPORT_ADMIN'
  | 'CONTENT_MANAGER'
  | 'REVIEW_DISPUTE_MANAGER'
  | 'CHAT_MODERATOR';

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  FINANCE_ADMIN: 'Finance Admin',
  VENDOR_MANAGER: 'Vendor Manager',
  BOOKING_MANAGER: 'Booking Manager',
  PREMIUM_PLANNING_MANAGER: 'Premium Planning Manager',
  SUPPORT_ADMIN: 'Support Admin',
  CONTENT_MANAGER: 'Content Manager',
  REVIEW_DISPUTE_MANAGER: 'Review & Dispute Manager',
  CHAT_MODERATOR: 'Chat Moderator',
};

export const ADMIN_ROUTE_PERMISSIONS: Record<string, string> = {
  '/admin': 'dashboard.view',
  '/admin/change-password': 'dashboard.view',
  '/admin/admins': 'admins.manage',
  '/admin/audit-logs': 'audit.view',
  '/admin/vendors': 'vendors.view',
  '/admin/customers': 'customers.view',
  '/admin/bookings': 'bookings.view',
  '/admin/premium-planning': 'premium-planning.view',
  '/admin/payments': 'payments.view',
  '/admin/reviews': 'reviews.view',
  '/admin/notifications': 'notifications.view',
  '/admin/chat-moderation': 'chat.view',
  '/admin/content': 'content.view',
  '/admin/settings': 'settings.view',
};

export function hasAdminPermission(
  user: User | null,
  permission: string,
) {
  if (
    user?.role === 'admin' &&
    user.permissions === undefined &&
    user.adminRole == null
  ) {
    return true;
  }

  return (
    user?.role === 'admin' &&
    (user.permissions?.includes(permission) ?? false)
  );
}

export function permissionForAdminPath(pathname: string) {
  const route = Object.keys(ADMIN_ROUTE_PERMISSIONS)
    .sort((a, b) => b.length - a.length)
    .find(
      (candidate) =>
        pathname === candidate || pathname.startsWith(`${candidate}/`),
    );

  return route ? ADMIN_ROUTE_PERMISSIONS[route] : 'dashboard.view';
}

export function firstAllowedAdminRoute(user: User | null) {
  return (
    Object.entries(ADMIN_ROUTE_PERMISSIONS).find(([, permission]) =>
      hasAdminPermission(user, permission),
    )?.[0] ?? '/'
  );
}
