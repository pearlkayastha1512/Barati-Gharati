"use client";

import { useState } from "react";

import {
  User,
  Mail,
  Phone,
  Pencil,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useCustomerProfileStore } from "@/store/customerProfileStore";

import ProfileModal from "../profile/ProfileModal";

export default function AccountSettings() {
  const [open, setOpen] =
    useState(false);

  const {
    user,
    updateUser,
  } = useAuthStore();

  const {
    profile,
    updateProfile,
  } =
    useCustomerProfileStore();

  if (!user || !profile) {
    return null;
  }

  return (
    <>
      <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-rose-500">
            Account
          </h2>

          <button
            onClick={() =>
              setOpen(true)
            }
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
          >
            <Pencil size={16} />

            Edit

          </button>

        </div>

        <div className="space-y-6">

          <Item
            icon={<User size={18} />}
            label="Full Name"
            value={user.name}
          />

          <Item
            icon={<Mail size={18} />}
            label="Email"
            value={user.email}
          />

          <Item
            icon={<Phone size={18} />}
            label="Phone"
            value={user.phone}
          />

        </div>

      </section>

      <ProfileModal
        open={open}
        user={user}
        profile={profile}
        onClose={() =>
          setOpen(false)
        }
        onSave={(
          updatedUser,
          updatedProfile
        ) => {
          updateUser(updatedUser);

          updateProfile(
            updatedProfile
          );
        }}
      />
    </>
  );
}

function Item({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">

      <div className="rounded-xl bg-gray-100 p-3 text-gray-700">
        {icon}
      </div>

      <div>

        <p className="text-sm text-gray-500">
          {label}
        </p>

        <p className="font-semibold text-gray-900">
          {value}
        </p>

      </div>

    </div>
  );
}