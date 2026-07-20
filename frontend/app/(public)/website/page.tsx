"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Heart,
  Sparkles,
  Flower2,
  Gem,
  ArrowRight,
} from "lucide-react";

import { toast } from "sonner";

import { createWeddingWebsite } from "@/services/api/wedding-website.api";

export default function WebsiteLandingPage() {
  const router = useRouter();

  const [isCreating, setIsCreating] =
    useState(false);

  const handleCreateWebsite =
    async () => {
      try {
        setIsCreating(true);

        const website =
          await createWeddingWebsite();

        router.push(
          `/website/${website.slug}`,
        );
      } catch (error: any) {
        const message =
          error?.response?.data?.message;

        toast.error(
          message ||
            "Please create a booking before creating your wedding website.",
        );
      } finally {
        setIsCreating(false);
      }
    };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fffaf7]">
      {/* Background decorations */}

      <div className="absolute left-[-120px] top-[-120px] h-96 w-96 rounded-full bg-rose-200/30 blur-3xl" />

      <div className="absolute bottom-[-150px] right-[-150px] h-[30rem] w-[30rem] rounded-full bg-pink-200/30 blur-3xl" />

      <div className="absolute left-1/2 top-24 -translate-x-1/2 text-rose-100">
        <Heart size={250} strokeWidth={1} />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}

          <div>
            <div className="mb-6 flex items-center gap-3 text-rose-500">
              <Flower2 />

              <span className="text-sm uppercase tracking-[0.5em]">
                Forever Begins Here
              </span>
            </div>

            <h1 className="font-serif text-5xl leading-tight text-slate-900 md:text-7xl">
              Create Your
              <span className="block text-rose-600">
                Wedding Website
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-9 text-slate-600">
              Design a beautiful wedding website
              to share your love story, wedding
              details, special moments, and
              unforgettable memories with your
              family and friends.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <div className="rounded-full bg-white text-gray-600 px-5 py-3 shadow-lg">
                💍 Wedding Details
              </div>

              <div className="rounded-full bg-white text-gray-600  px-5 py-3 shadow-lg">
                📸 Gallery
              </div>

              <div className="rounded-full bg-white text-gray-600  px-5 py-3 shadow-lg">
                ❤️ Love Story
              </div>
            </div>

            <button
              onClick={handleCreateWebsite}
              disabled={isCreating}
              className="mt-12 flex items-center gap-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-10 py-5 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating
                ? "Creating..."
                : "Create My Website"}

              <ArrowRight size={20} />
            </button>
          </div>

          {/* Right */}

          <div className="relative">
            {/* Main card */}

            <div className="relative overflow-hidden rounded-[40px] border border-white/50 bg-white/80 p-10 shadow-[0_25px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl">
              <div className="absolute right-8 top-8 text-rose-300">
                <Sparkles size={28} />
              </div>

              <div className="flex justify-center">
                <div className="rounded-full bg-rose-50 p-6">
                  <Gem
                    size={50}
                    className="text-rose-500"
                  />
                </div>
              </div>

              <h2 className="mt-8 text-center font-serif text-4xl text-slate-900">
                Classic Theme
              </h2>

              <p className="mt-4 text-center text-slate-500">
                Inspired by royal Indian weddings,
                elegant celebrations, floral
                decorations, and timeless love
                stories.
              </p>

              <div className="mt-10 space-y-5">
                <div className="flex items-center gap-4 rounded-2xl bg-rose-50 p-4">
                  <span className="text-2xl">
                    🌸
                  </span>

                  <div>
                    <p className="font-semibold text-gray-600 ">
                      Elegant Design
                    </p>

                    <p className="text-sm text-slate-500">
                      Crafted for modern weddings.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-pink-50 p-4">
                  <span className="text-2xl">
                    💕
                  </span>

                  <div>
                    <p className="font-semibold text-gray-600 ">
                      Share Your Story
                    </p>

                    <p className="text-sm text-slate-500">
                      Tell everyone how you met.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-amber-50 p-4">
                  <span className="text-2xl">
                    🎊
                  </span>

                  <div>
                    <p className="font-semibold text-gray-600 ">
                      Celebrate Together
                    </p>

                    <p className="text-sm text-slate-500">
                      Invite your loved ones.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-center text-4xl">
                💍 ❤️ 💍
              </div>
            </div>

            {/* Floating elements */}

            <div className="absolute -left-6 top-10 rounded-2xl bg-white p-4 shadow-xl">
              🌹
            </div>

            <div className="absolute -right-6 bottom-16 rounded-2xl bg-white p-4 shadow-xl">
              ✨
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}