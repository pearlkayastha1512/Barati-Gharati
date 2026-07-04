"use client";

import Link from "next/link";

import {
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

import FooterColumn from "./FooterColumn";

import { FOOTER_LINKS } from "@/constants/footer";

export default function Footer() {
  const socialIcons = [
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaTwitter,
  ];

  return (
    <footer className="relative overflow-hidden bg-[#0D0708] text-white">
      {/* Top Border */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-rose-500 to-transparent" />

      {/* Background Glow */}
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-rose-500/10 blur-[120px]" />

      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-pink-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-16 lg:grid-cols-4">
          {/* Logo */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-4xl font-bold tracking-wide"
            >
              Wed
              <span className="text-rose-500">
                Plan
              </span>
            </Link>

            <p className="mt-6 max-w-md leading-8 text-gray-400">
              Making wedding planning effortless with
              verified vendors, beautiful inspiration,
              transparent pricing and unforgettable
              experiences across India.
            </p>

            {/* Contact */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Phone
                  size={18}
                  className="text-rose-500"
                />

                +91 98765 43210
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <Mail
                  size={18}
                  className="text-rose-500"
                />

                hello@wedplan.com
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <MapPin
                  size={18}
                  className="text-rose-500"
                />

                New Delhi, India
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-8 flex gap-4">
              {socialIcons.map((Icon, index) => (
                <button
                  key={index}
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-[#1A1012]
                    text-gray-300
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-rose-500
                    hover:text-white
                  "
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Footer Columns */}
          <FooterColumn
            title="Company"
            links={FOOTER_LINKS.company}
          />

         

          <FooterColumn
            title="Resources"
            links={FOOTER_LINKS.resources}
          />
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-white/10" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-gray-400 md:flex-row">
          <p>
            © {new Date().getFullYear()} WedPlan. All
            rights reserved.
          </p>

          <p className="flex items-center gap-2">
            Made with
            <Heart
              size={16}
              className="fill-rose-500 text-rose-500"
            />
            in India
          </p>
        </div>
      </div>
    </footer>
  );
}