


"use client";


import { Calendar, MessageCircle, Users } from "lucide-react";
import BookingModal from "./BookingModal";
import { useAuthStore } from "@/store/authStore";
import { getVendorServices } from "@/services/service.service";

import { Vendor } from "@/types/vendor";

import { useRouter } from "next/navigation";
import { useMessageStore } from "@/store/messageStore";
import { messageService } from "@/services/message.service";
import { toast } from "sonner";
import { getVendorById } from "@/services/vendor.service";
import { useEffect, useState } from "react";
import {
  VENDOR_BADGE_COLORS,
  VENDOR_BADGE_LABELS,
} from "@/constants/vendor-badges";

interface VendorBookingCardProps {
  vendor: Vendor;
}
    
export default function VendorBookingCard({
  vendor,
}: VendorBookingCardProps) {


  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [inputDate, setInputDate] = useState("");
  const [guests, setGuests] = useState(200);
  const [open, setOpen] = useState(false);

  const router = useRouter();

const {
  conversations,
  loadConversations,
  sendNewMessage,
  setSelectedConversation,
} = useMessageStore();

 const {
  isAuthenticated,
  openLogin,
  user,
} = useAuthStore();
    
const [packages, setPackages] = useState<
  {
    id: string;
    name: string;
    price: number;
  }[]
>([]);

const [selectedPackage, setSelectedPackage] =
  useState<{
    id: string;
    name: string;
    price: number;
  } | null>(null);

useEffect(() => {
  async function loadPackages() {
    const services = await getVendorServices(vendor.id);

    const mapped = services.map((service) => ({
      id: service.id,
      name: service.name,
      price: service.price,
    }));

    setPackages(mapped);

    if (mapped.length > 0) {
      setSelectedPackage(mapped[0]);
    }
  }

  loadPackages();
}, [vendor.id]);

if (!selectedPackage)  {
  return (
    <aside className="rounded-3xl border border-white/10 bg-[#1b1017] p-8 shadow-2xl shadow-black/30">

      <h2 className="text-2xl font-bold text-white">
        No Services Available
      </h2>

      <p className="mt-3 text-rose-100/70">
        This vendor has not added any services yet.
      </p>

    </aside>
  );
}

 
const canBook =
  !isAuthenticated ||
  user?.role === "customer";

const badge = vendor.badge ?? "bronze";

  return (

    
    <>
    <aside
      className="
        sticky
        top-28
        rounded-3xl
        border
        border-white/10
        bg-[#1b1017]/95
        p-7
        shadow-2xl
        shadow-black/30
        backdrop-blur
      "
    >
      {/* Header */}

      <p className="text-sm font-medium text-rose-100/65">
        Starting From
      </p>

      <h2 className="mt-2 text-4xl font-bold text-rose-300">
        ₹{selectedPackage.price.toLocaleString("en-IN")}
      </h2>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${VENDOR_BADGE_COLORS[badge]}`}
        >
          {VENDOR_BADGE_LABELS[badge]} Vendor
        </span>

        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-rose-100/70">
          {vendor.currentMonthBookings ?? 0}/
          {vendor.monthlyBookingLimit ?? 5} bookings this month
        </span>
      </div>

      {/* Package */}

      <div className="mt-8">

        <label className="mb-2 block text-sm font-semibold text-rose-50">
          Select Package
        </label>

        <select
          value={selectedPackage.id}
          onChange={(e) => {
            const pkg = packages.find(
  (item) => item.id === e.target.value
);

if (pkg) {
  setSelectedPackage(pkg);
}
          }}
          className="
            h-12
            w-full
            rounded-xl
            border
            border-white/15
            bg-[#12070d]
            px-4
            text-rose-50
            outline-none
            transition
            focus:border-rose-300
          "
        >
          {packages.map((pkg) => (
            <option
              key={pkg.id}
              value={pkg.id}
            >
              {pkg.name} — ₹{pkg.price.toLocaleString("en-IN")}
            </option>
          ))}
        </select>

      </div>

      {/* Event Date(s) Multi-Selector */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-rose-50">
            <Calendar className="h-4 w-4 text-rose-400" />
            Event Date(s)
          </label>
          {selectedDates.length > 0 && (
            <span className="rounded-full border border-rose-500/20 bg-rose-950/60 px-2 py-0.5 text-[11px] font-bold text-rose-300">
              {selectedDates.length} {selectedDates.length === 1 ? "Date" : "Dates"}
            </span>
          )}
        </div>

        {selectedDates.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedDates.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-400/30 bg-rose-900/40 px-3 py-1.5 text-xs font-semibold text-rose-100 shadow-sm"
              >
                <span>{new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                <button
                  type="button"
                  onClick={() => setSelectedDates((prev) => prev.filter((item) => item !== d))}
                  className="font-bold text-rose-300 transition hover:text-rose-400"
                  title="Remove date"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          type="date"
          value={inputDate}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => {
            const val = e.target.value;
            if (val && !selectedDates.includes(val)) {
              setSelectedDates((prev) => [...prev, val].sort());
            }
            setInputDate("");
          }}
          className="h-12 w-full rounded-xl border border-white/15 bg-[#12070d] px-4 text-xs font-medium text-rose-50 outline-none transition focus:border-rose-300 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />
        <p className="mt-1.5 text-[11px] text-rose-200/60">
          💡 Select multiple dates for multi-day events (Haldi, Wedding, etc.).
        </p>
      </div>

      {/* Guests */}

      <div className="mt-6">

        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-50">

          <Users size={16} />

          Guests

        </label>

        <div className="flex items-center justify-between rounded-xl border border-white/15 bg-[#12070d] px-4 py-3">

          <button
            onClick={() => setGuests((g) => Math.max(1, g - 10))}
            className="text-2xl font-bold text-rose-100 transition hover:text-rose-300"
          >
            −
          </button>

          <span className="text-lg font-semibold text-white">
            {guests}
          </span>

          <button
            onClick={() => setGuests((g) => g + 10)}
            className="text-2xl font-bold text-rose-100 transition hover:text-rose-300"
          >
            +
          </button>

        </div>

      </div>

      {/* Estimated Price */}

      <div className="mt-8 rounded-2xl border border-rose-300/15 bg-rose-400/10 p-5">

        <p className="text-sm text-rose-100/65">
          Estimated Price
        </p>

        <h3 className="mt-2 text-3xl font-bold text-rose-300">
          ₹{selectedPackage.price.toLocaleString("en-IN")}
        </h3>

        <p className="mt-2 text-sm text-rose-100/65">
          *Final quotation may vary based on guest count and custom requirements.
        </p>

      </div>

      {/* Buttons */}

     

 {canBook && (
  <button

  
   onClick={async () => {
 const storedVendor = await getVendorById(vendor.id);

if (!storedVendor) {
  toast.error("Vendor not found.");
  return;
}

if (selectedDates.length === 0) {
  toast.error("Please select at least one event date.");
  return;
}

  if (isAuthenticated) {
    setOpen(true);
  } else {
    openLogin();
  }
}}





    className="
      mt-8
      flex
      w-full
      items-center
      justify-center
      gap-2
      rounded-xl
      bg-gradient-to-r
      from-rose-600
      to-pink-600
      py-4
      font-semibold
      text-white
      shadow-lg
      shadow-rose-950/50
      transition-all
      duration-300
      hover:scale-[1.02]
    "
  >




    <Calendar size={20} />
    Book Now
  </button>
)}







      {/* Why Book */}

      <div className="mt-8 rounded-2xl border border-rose-300/15 bg-white/[0.05] p-5">

        <h3 className="font-semibold text-white">
          Why Book Here?
        </h3>

        <ul className="mt-4 space-y-3 text-sm text-rose-100/70">

          <li>✅ Verified Vendor</li>

          <li>⚡ Response within 2 Hours</li>

          <li>💯 Best Price Guarantee</li>

          <li>🎉 500+ Successful Weddings</li>

          <li>🔒 Secure Booking Process</li>

        </ul>

      </div>

    </aside>

    <BookingModal
  open={open}
  onClose={() => setOpen(false)}
  vendorId={vendor.id}
  vendorName={vendor.name}
  category={vendor.category}
  city={vendor.city}
  packageName={selectedPackage.name}
  price={selectedPackage.price}
  guests={guests}
  date={selectedDates[0] || ""}
  eventDates={selectedDates}
/>
    </>
  );
}
