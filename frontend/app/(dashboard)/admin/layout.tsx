import { ReactNode } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/admin/layout/DashboardLayout";
import AdminPermissionRoute from "@/components/auth/AdminPermissionRoute";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <ProtectedRoute role="admin">
      <DashboardLayout>
        <AdminPermissionRoute>{children}</AdminPermissionRoute>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
