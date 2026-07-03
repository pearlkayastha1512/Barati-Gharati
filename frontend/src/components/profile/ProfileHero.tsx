"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import Image from "next/image";

import {
  User,
  CalendarDays,
  CheckCircle2,
  Pencil,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useCustomerProfileStore } from "@/store/customerProfileStore";

import ProfileModal from "./ProfileModal";

export default function ProfileHero() {
  const [open, setOpen] =
    useState(false);

  const {
    user,
    updateUser,
  } = useAuthStore();

  const {
    profile,
    loadProfile,
    updateProfile,
  } =
    useCustomerProfileStore();

  useEffect(() => {
    if (user) {
      loadProfile(user._id);
    }
  }, [user, loadProfile]);

  if (!user || !profile) {
    return null;
  }

  return (
    <>
      <motion.section
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="
          relative
          overflow-hidden
          rounded-[32px]
          bg-gradient-to-br
          from-sky-500
          via-cyan-500
          to-blue-600
          p-8
          text-white
          shadow-xl
        "
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-6">

            <Image
              src={
                user.avatar ||
                "/images/about-cta.jpg"
              }
              alt={user.name}
              width={110}
              height={110}
              className="rounded-full border-4 border-white object-cover"
            />

            <div>

              <h1 className="text-4xl font-bold">
                {user.name}
              </h1>

              <p className="mt-2 text-lg text-cyan-100 capitalize">
                {user.role}
              </p>

            </div>

          </div>

          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">

            <div className="space-y-4">

              <div className="flex items-center gap-3">

                <User size={20} />

                <span>
                  Profile Verified
                </span>

                {user.isVerified && (
                  <CheckCircle2
                    size={18}
                    className="text-green-300"
                  />
                )}

              </div>

              <div className="flex items-center gap-3">

                <CalendarDays
                  size={20}
                />

                <span>
                  {profile.weddingDate
                    ? new Date(
                        profile.weddingDate
                      ).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "Wedding date not set"}
                </span>

              </div>

              <button
                onClick={() =>
                  setOpen(true)
                }
                className="
                  mt-4
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-4
                  py-2
                  font-semibold
                  text-sky-600
                "
              >
                <Pencil size={18} />

                Edit Profile

              </button>

            </div>

          </div>

        </div>

      </motion.section>

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