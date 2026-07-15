'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  firstAllowedAdminRoute,
  hasAdminPermission,
  permissionForAdminPath,
} from '@/lib/adminAccess';

export default function AdminPermissionRoute({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const requiredPermission = permissionForAdminPath(pathname);
  const allowed = hasAdminPermission(user, requiredPermission);
  const mustChangePassword = Boolean(user?.mustChangePassword);
  const isPasswordPage = pathname === '/admin/change-password';

  useEffect(() => {
    if (mustChangePassword && !isPasswordPage) {
      router.replace('/admin/change-password');
      return;
    }

    if (!allowed) {
      router.replace(firstAllowedAdminRoute(user));
    }
  }, [allowed, isPasswordPage, mustChangePassword, router, user]);

  if (!allowed || (mustChangePassword && !isPasswordPage)) return null;
  return <>{children}</>;
}
