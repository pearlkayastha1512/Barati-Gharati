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
import { useCustomerProfileData } from "@/hooks/useCustomerProfileData";

import ProfileModal from "../profile/ProfileModal";

export default function AccountSettings() {
  const [open, setOpen] =
    useState(false);

  const {
    user,
    updateUser,
  } = useAuthStore();
  const { personal } =
    useCustomerProfileData();

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
      <section className="rounded-3xl border border-[#ffb3bf] bg-[#fffdf0] p-7 shadow-sm">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-[#ff4d6d]">
            Account
          </h2>

          <button
            onClick={() =>
              setOpen(true)
            }
            className="flex items-center gap-2 rounded-xl bg-[#ff4d6d] px-4 py-2 text-white transition hover:bg-[#e63b5f]"
          >
            <Pencil size={16} />

            Edit

          </button>

        </div>

        <div className="space-y-6">

          <Item
            icon={<User size={18} />}
            label="Full Name"
            value={personal.fullName}
          />

          <Item
            icon={<Mail size={18} />}
            label="Email"
            value={personal.email}
          />

          <Item
            icon={<Phone size={18} />}
            label="Phone"
            value={
              personal.phone ||
              "Not Provided"
            }
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

      <div className="rounded-xl bg-[#fff8d8] p-3 text-[#6c2d45]">
        {icon}
      </div>

      <div>

        <p className="text-sm text-[#8d6171]">
          {label}
        </p>

        <p className="font-semibold text-[#3f1d2f]">
          {value}
        </p>

      </div>

    </div>
  );
}
