"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { AdminRole } from "@/lib/adminAccess";
import {
  AdminAccount,
  AdminRoleDefinition,
  createAdminAccountApi,
  getAdminAccountsApi,
  getAdminRoleDefinitionsApi,
  resetAdminPasswordApi,
  updateAdminAccountApi,
} from "@/services/api/admin.api";

function responseData<T>(value: unknown): T[] {
  const response = value as { data?: T[] } | undefined;
  return Array.isArray(response?.data) ? response.data : [];
}

export default function AdminAccountsPage() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [roles, setRoles] = useState<AdminRoleDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("FINANCE_ADMIN");
  const [extraPermissions, setExtraPermissions] = useState<string[]>([]);

  const allPermissions = useMemo(
    () => Array.from(new Set(roles.flatMap((item) => item.permissions))).sort(),
    [roles],
  );
  const basePermissions =
    roles.find((item) => item.role === role)?.permissions ?? [];

  const load = async () => {
    setLoading(true);
    const [adminsResult, rolesResult] = await Promise.all([
      getAdminAccountsApi(),
      getAdminRoleDefinitionsApi(),
    ]);

    if (!adminsResult.ok || !rolesResult.ok) {
      toast.error(adminsResult.error ?? rolesResult.error ?? "Unable to load admin access.");
      setLoading(false);
      return;
    }

    setAdmins(responseData<AdminAccount>(adminsResult.data));
    setRoles(responseData<AdminRoleDefinition>(rolesResult.data));
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const result = await createAdminAccountApi({
      name,
      email,
      password,
      adminRole: role,
      permissions: extraPermissions.filter(
        (permission) => !basePermissions.includes(permission),
      ),
    });
    setSaving(false);

    if (!result.ok) {
      toast.error(result.error ?? "Unable to create admin account.");
      return;
    }

    toast.success("Admin login created successfully.");
    setName("");
    setEmail("");
    setPassword("");
    setExtraPermissions([]);
    await load();
  };

  const update = async (
    admin: AdminAccount,
    data: Parameters<typeof updateAdminAccountApi>[1],
  ) => {
    const result = await updateAdminAccountApi(admin.id, data);
    if (!result.ok) {
      toast.error(result.error ?? "Unable to update admin.");
      return;
    }
    toast.success("Admin access updated.");
    await load();
  };

  const resetPassword = async (admin: AdminAccount) => {
    const nextPassword = window.prompt(
      `Enter a new temporary password for ${admin.email} (minimum 8 characters):`,
    );
    if (!nextPassword) return;
    const result = await resetAdminPasswordApi(admin.id, nextPassword);
    result.ok
      ? toast.success("Temporary password updated.")
      : toast.error(result.error ?? "Unable to reset password.");
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-[#ff4d6d] to-[#ffb703] p-8 text-[#3f1d2f] shadow-xl">
        <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em]">
          <ShieldCheck size={20} /> Secure administration
        </div>
        <h1 className="mt-4 text-4xl font-black">Admin Roles & Login Access</h1>
        <p className="mt-3 max-w-3xl font-medium">
          Create manual admin login IDs and control exactly which dashboard modules and actions each account can access.
        </p>
      </section>

      <form onSubmit={submit} className="rounded-3xl border border-[#ffb3bf] bg-white p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <UserPlus className="text-[#ff4d6d]" />
          <h2 className="text-2xl font-extrabold text-[#3f1d2f]">Create Admin Login</h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Input label="Full Name" value={name} onChange={setName} required />
          <Input label="Login Email" value={email} onChange={setEmail} type="email" required />
          <Input label="Temporary Password" value={password} onChange={setPassword} type="password" minLength={8} required />
          <label className="space-y-2 text-sm font-semibold text-[#6c2d45]">
            <span>Role</span>
            <select
              value={role}
              onChange={(event) => {
                setRole(event.target.value as AdminRole);
                setExtraPermissions([]);
              }}
              className="w-full rounded-2xl border border-[#ffb3bf] bg-[#fffef7] px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff4d6d]/30"
            >
              {roles.map((item) => (
                <option key={item.role} value={item.role}>{item.label}</option>
              ))}
            </select>
          </label>
        </div>

        <details className="mt-6 rounded-2xl border border-[#ffd0d8] bg-[#fff8f9] p-4">
          <summary className="cursor-pointer font-bold text-[#6c2d45]">Optional additional feature permissions</summary>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {allPermissions.map((permission) => {
              const includedByRole = basePermissions.includes(permission);
              const checked = includedByRole || extraPermissions.includes(permission);
              return (
                <label key={permission} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-[#6c2d45]">
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={includedByRole}
                    onChange={(event) =>
                      setExtraPermissions((current) =>
                        event.target.checked
                          ? [...current, permission]
                          : current.filter((item) => item !== permission),
                      )
                    }
                  />
                  {permission}
                  {includedByRole && <span className="ml-auto text-xs text-[#b85f7b]">role</span>}
                </label>
              );
            })}
          </div>
        </details>

        <button disabled={saving} className="mt-6 rounded-2xl bg-[#ff4d6d] px-6 py-3 font-bold text-white shadow-lg disabled:opacity-60">
          {saving ? "Creating…" : "Create Admin Login"}
        </button>
      </form>

      <section className="overflow-hidden rounded-3xl border border-[#ffb3bf] bg-white shadow-sm">
        <div className="border-b border-[#ffd0d8] p-6">
          <h2 className="text-2xl font-extrabold text-[#3f1d2f]">Admin Accounts</h2>
          <p className="mt-1 text-[#8d6171]">Role changes take effect immediately on backend requests.</p>
        </div>

        {loading ? (
          <p className="p-8 text-[#8d6171]">Loading admin access…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-[#fff8f9] text-sm text-[#6c2d45]">
                <tr>
                  <th className="px-6 py-4">Admin</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Extra Access</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-t border-[#ffe0e5] text-[#5c3343]">
                    <td className="px-6 py-5">
                      <p className="font-bold">{admin.name}</p>
                      <p className="text-sm text-[#8d6171]">{admin.email}</p>
                    </td>
                    <td className="px-6 py-5">
                      <select
                        value={admin.adminRole ?? "SUPER_ADMIN"}
                        onChange={(event) => void update(admin, { adminRole: event.target.value as AdminRole })}
                        className="rounded-xl border border-[#ffb3bf] bg-white px-3 py-2"
                      >
                        {roles.map((item) => <option key={item.role} value={item.role}>{item.label}</option>)}
                      </select>
                    </td>
                    <td className="max-w-sm px-6 py-5 text-sm">
                      <AdminPermissionEditor
                        admin={admin}
                        roles={roles}
                        allPermissions={allPermissions}
                        onUpdate={(permissions) =>
                          void update(admin, { permissions })
                        }
                      />
                    </td>
                    <td className="px-6 py-5">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${admin.adminIsActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {admin.adminIsActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <button onClick={() => void update(admin, { adminIsActive: !admin.adminIsActive })} className="rounded-xl bg-[#ffe6eb] px-3 py-2 text-sm font-bold text-[#b42355]">
                          {admin.adminIsActive ? "Deactivate" : "Activate"}
                        </button>
                        <button onClick={() => void resetPassword(admin)} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">
                          Reset Password
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function AdminPermissionEditor({
  admin,
  roles,
  allPermissions,
  onUpdate,
}: {
  admin: AdminAccount;
  roles: AdminRoleDefinition[];
  allPermissions: string[];
  onUpdate: (permissions: string[]) => void;
}) {
  const effectiveRole = admin.adminRole ?? "SUPER_ADMIN";
  const basePermissions =
    roles.find((item) => item.role === effectiveRole)?.permissions ?? [];

  return (
    <details>
      <summary className="cursor-pointer font-semibold text-[#b42355]">
        {admin.adminPermissions.length
          ? `${admin.adminPermissions.length} extra permission(s)`
          : "Role defaults only"}
      </summary>
      <div className="mt-3 max-h-72 min-w-72 space-y-1 overflow-y-auto rounded-xl border border-[#ffd0d8] bg-[#fff8f9] p-3">
        {allPermissions.map((permission) => {
          const includedByRole = basePermissions.includes(permission);
          const includedExtra = admin.adminPermissions.includes(permission);
          return (
            <label key={permission} className="flex items-center gap-2 rounded-lg bg-white px-2 py-1.5 text-xs">
              <input
                type="checkbox"
                checked={includedByRole || includedExtra}
                disabled={includedByRole}
                onChange={(event) =>
                  onUpdate(
                    event.target.checked
                      ? Array.from(new Set([...admin.adminPermissions, permission]))
                      : admin.adminPermissions.filter((item) => item !== permission),
                  )
                }
              />
              <span>{permission}</span>
              {includedByRole && <span className="ml-auto text-[#b85f7b]">role</span>}
            </label>
          );
        })}
      </div>
    </details>
  );
}

function Input({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className="space-y-2 text-sm font-semibold text-[#6c2d45]">
      <span>{label}</span>
      <input
        {...props}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-[#ffb3bf] bg-[#fffef7] px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff4d6d]/30"
      />
    </label>
  );
}
