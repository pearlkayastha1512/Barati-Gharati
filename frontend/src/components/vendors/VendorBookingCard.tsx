


"use client";

import { useState } from "react";
import { Calendar, MessageCircle, Users } from "lucide-react";
import BookingModal from "./BookingModal";
import { useAuthStore } from "@/store/authStore";
import { getVendorServices } from "@/services/service.service";

import { Vendor } from "@/types/vendor";

import { useRouter } from "next/navigation";
import { useMessageStore } from "@/store/messageStore";
import { toast } from "sonner";
import { getVendorById } from "@/services/vendor.service";

interface VendorBookingCardProps {
  vendor: Vendor;
}
    
export default function VendorBookingCard({
  vendor,
}: VendorBookingCardProps) {


  const packages = getVendorServices(vendor.id).map(
  (service, index) => ({
    id: index + 1,
    name: service.name,
    price: service.price,
  })
);
  const [selectedPackage, setSelectedPackage] = useState(
  () => packages[0]
);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(200);
  const [open, setOpen] = useState(false);

  const router = useRouter();

const {
  messages,
  sendMessage,
  setSelectedConversation,
} = useMessageStore();
    


if (packages.length === 0) {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

      <h2 className="text-2xl font-bold text-slate-900">
        No Services Available
      </h2>

      <p className="mt-3 text-slate-500">
        This vendor hasn't added any services yet.
      </p>

    </aside>
  );
}

  const {
  isAuthenticated,
  openLogin,
  user,
} = useAuthStore();
const canBook =
  !isAuthenticated ||
  user?.role === "customer";
  return (

    
    <>
    <aside
      className="
        sticky
        top-28
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-7
        shadow-xl
      "
    >
      {/* Header */}

      <p className="text-sm font-medium text-gray-500">
        Starting From
      </p>

      <h2 className="mt-2 text-4xl font-bold text-rose-600">
        ₹{selectedPackage.price.toLocaleString("en-IN")}
      </h2>

      {/* Package */}

      <div className="mt-8">

        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Select Package
        </label>

        <select
          value={selectedPackage.id}
          onChange={(e) => {
            const pkg = packages.find(
              (item) => item.id === Number(e.target.value)
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
            border-gray-300
            bg-white
            px-4
            text-gray-700
            outline-none
            transition
            focus:border-rose-500
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

      {/* Date */}

      <div className="mt-6">

        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Wedding Date
        </label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="
            h-12
            w-full
            rounded-xl
            border
            border-gray-300
            px-4
            text-gray-700
            outline-none
            transition
            focus:border-rose-500
          "
        />

      </div>

      {/* Guests */}

      <div className="mt-6">

        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">

          <Users size={16} />

          Guests

        </label>

        <div className="flex items-center justify-between rounded-xl border border-gray-300 px-4 py-3">

          <button
            onClick={() => setGuests((g) => Math.max(50, g - 50))}
            className="text-2xl font-bold text-gray-700 transition hover:text-rose-500"
          >
            −
          </button>

          <span className="text-lg font-semibold text-gray-900">
            {guests}
          </span>

          <button
            onClick={() => setGuests((g) => g + 50)}
            className="text-2xl font-bold text-gray-700 transition hover:text-rose-500"
          >
            +
          </button>

        </div>

      </div>

      {/* Estimated Price */}

      <div className="mt-8 rounded-2xl bg-rose-50 p-5">

        <p className="text-sm text-gray-500">
          Estimated Price
        </p>

        <h3 className="mt-2 text-3xl font-bold text-rose-600">
          ₹{selectedPackage.price.toLocaleString("en-IN")}
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          *Final quotation may vary based on guest count and custom requirements.
        </p>

      </div>

      {/* Buttons */}

     

 {canBook && (
  <button
    onClick={() => {
  const storedVendor = getVendorById(
    vendor.id
  );

  if (
    storedVendor &&
    (!storedVendor.isActive ||
      storedVendor.approvalStatus !==
        "approved")
  ) {
    toast.error(
      "This vendor is currently unavailable."
    );

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
      from-rose-500
      to-pink-500
      py-4
      font-semibold
      text-white
      shadow-lg
      transition-all
      duration-300
      hover:scale-[1.02]
    "
  >




    <Calendar size={20} />
    Book Now
  </button>
)}

     <button
 onClick={() => {
  if (!isAuthenticated) {
    openLogin();
    return;
  }

  if (user?.role !== "customer") {
    return;
  }

  const exists = messages.some(
    (message) =>
      (message.senderId === user._id &&
        message.receiverId === vendor.userId) ||
      (message.receiverId === user._id &&
        message.senderId === vendor.userId)
  );

  if (!exists) {
    sendMessage({
      id: crypto.randomUUID(),

      senderId: user._id,

      senderName: user.name,

      receiverId: vendor.userId,

      receiverName: vendor.name,

      message:
        "Hello! I'm interested in your services.",

      sentAt: new Date().toISOString(),

      status: "sent",
    });
  }

 setSelectedConversation(vendor.userId);

  router.push("/customer/messages");
}}
  className="
    mt-4
    flex
    w-full
    items-center
    justify-center
    gap-2
    rounded-xl
    border
    border-gray-300
    py-4
    font-semibold
    text-gray-700
    transition
    hover:border-rose-500
    hover:text-rose-500
  "
>
  <MessageCircle size={20} />
  Send Inquiry



</button>







      {/* Why Book */}

      <div className="mt-8 rounded-2xl bg-rose-50 p-5">

        <h3 className="font-semibold text-gray-900">
          Why Book Here?
        </h3>

        <ul className="mt-4 space-y-3 text-sm text-gray-600">

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
  date={date}
/>
    </>
  );
}