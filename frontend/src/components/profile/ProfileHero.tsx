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
          bg-[linear-gradient(135deg,#ff4d6d_0%,#ff7f96_46%,#fff3b0_100%)]
          p-8
          text-[#111111]
          shadow-xl
          shadow-[#ff4d6d]/20
        "
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.34)_0_1px,transparent_1px)] bg-[length:34px_34px] opacity-45" />

        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fff8d8]/55 to-transparent" />

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
              className="rounded-full border-4 border-[#fffdf0] object-cover shadow-xl shadow-[#ff4d6d]/30"
            />

            <div>

              <h1 className="text-4xl font-bold text-[#fffdf0] drop-shadow-sm">
                {user.name}
              </h1>

              <p className="mt-2 inline-flex rounded-full bg-[#fff8d8]/90 px-4 py-1 text-sm font-bold capitalize text-[#111111] shadow-sm">
                {user.role}
              </p>

            </div>

          </div>

          <div className="rounded-3xl border border-white/70 bg-[#fff8d8]/90 p-6 text-[#111111] shadow-lg shadow-[#ff4d6d]/10 backdrop-blur">

            <div className="space-y-4">

              <div className="flex items-center gap-3">

                <User
                  size={20}
                  className="text-[#ff4d6d]"
                />

                <span>
                  Profile Verified
                </span>

                {user.isVerified && (
                  <CheckCircle2
                    size={18}
                    className="text-[#ff4d6d]"
                  />
                )}

              </div>

              <div className="flex items-center gap-3">

                <CalendarDays
                  size={20}
                  className="text-[#ff4d6d]"
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
                  bg-[#ff4d6d]
                  px-4
                  py-2
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-[#ff4d6d]/25
                  transition
                  hover:bg-[#e63b5f]
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
