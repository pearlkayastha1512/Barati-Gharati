"use client";

import { useEffect, useState } from "react";

import { X } from "lucide-react";

import { toast } from "sonner";

import { User } from "@/types/auth";
import { CustomerProfile } from "@/types/customerProfile";

interface Props {
  open: boolean;
  user: User;
  profile: CustomerProfile;
  onClose: () => void;
  onSave: (
    user: User,
    profile: CustomerProfile
  ) => void;
}

export default function ProfileModal({
  open,
  user,
  profile,
  onClose,
  onSave,
}: Props) {
  const [userData, setUserData] =
    useState(user);

  const [profileData, setProfileData] =
    useState(profile);

  useEffect(() => {
    setUserData(user);
    setProfileData(profile);
  }, [user, profile]);

  if (!open) return null;

  const save = () => {
    onSave(userData, profileData);

    toast.success(
      "Profile updated successfully."
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-8 text-gray-700">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">
            Edit Profile
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 transition hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Personal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-600">
              Personal Information
            </h3>

            <input
              value={userData.name}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  name: e.target.value,
                })
              }
              placeholder="Full Name"
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 placeholder:text-gray-400"
            />

            <input
              value={userData.email}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  email: e.target.value,
                })
              }
              placeholder="Email"
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 placeholder:text-gray-400"
            />

            <input
              value={userData.phone}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  phone: e.target.value,
                })
              }
              placeholder="Phone"
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 placeholder:text-gray-400"
            />

            <input
              value={profileData.gender}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  gender: e.target.value,
                })
              }
              placeholder="Gender"
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-600">
              Contact Information
            </h3>

            <input
              value={profileData.address}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  address: e.target.value,
                })
              }
              placeholder="Address"
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 placeholder:text-gray-400"
            />

            <input
              value={profileData.city}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  city: e.target.value,
                })
              }
              placeholder="City"
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 placeholder:text-gray-400"
            />

            <input
              value={profileData.state}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  state: e.target.value,
                })
              }
              placeholder="State"
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 placeholder:text-gray-400"
            />

            <input
              value={profileData.country}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  country: e.target.value,
                })
              }
              placeholder="Country"
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Partner */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-600">
              Partner Information
            </h3>

            <input
              value={profileData.partnerName}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  partnerName: e.target.value,
                })
              }
              placeholder="Partner Name"
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 placeholder:text-gray-400"
            />

            <input
              value={profileData.partnerEmail}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  partnerEmail: e.target.value,
                })
              }
              placeholder="Partner Email"
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 placeholder:text-gray-400"
            />

            <input
              value={profileData.partnerPhone}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  partnerPhone: e.target.value,
                })
              }
              placeholder="Partner Phone"
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 placeholder:text-gray-400"
            />

            <input
              value={profileData.partnerOccupation}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  partnerOccupation: e.target.value,
                })
              }
              placeholder="Occupation"
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Wedding */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-600">
              Wedding Information
            </h3>

            <input
              type="date"
              value={profileData.weddingDate}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  weddingDate: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700"
            />

            <input
              value={profileData.weddingVenue}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  weddingVenue: e.target.value,
                })
              }
              placeholder="Venue"
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 placeholder:text-gray-400"
            />

            <input
              type="number"
              value={profileData.guestCount}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  guestCount: Number(e.target.value),
                })
              }
              placeholder="Guests"
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 placeholder:text-gray-400"
            />

            <input
              value={profileData.weddingTheme}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  weddingTheme: e.target.value,
                })
              }
              placeholder="Theme"
              className="w-full rounded-xl border border-gray-200 p-3 text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        <button
          onClick={save}
          className="mt-8 w-full rounded-2xl bg-rose-500 py-4 font-semibold text-white transition hover:bg-rose-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}