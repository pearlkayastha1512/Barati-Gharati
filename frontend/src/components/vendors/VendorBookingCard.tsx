


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

interface VendorBookingCardProps {
  vendor: Vendor;
}
    
export default function VendorBookingCard({
  vendor,
}: VendorBookingCardProps) {


  const [date, setDate] = useState("");
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
    <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

      <h2 className="text-2xl font-bold text-slate-900">
        No Services Available
      </h2>

      <p className="mt-3 text-slate-500">
        This vendor has not added any services yet.
      </p>

    </aside>
  );
}

 
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

  
   onClick={async () => {
 const storedVendor = await getVendorById(vendor.id);

if (!storedVendor) {
  toast.error("Vendor not found.");
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
 onClick={async () => {
  if (!isAuthenticated) {
    openLogin();
    return;
  }





  if (user?.role !== "customer") {
    return;
  }

  const existingConversation =
    conversations.find(
      (conversation) =>
        conversation.vendorId ===
          (vendor.backendId ?? vendor.id.toString()) ||
        conversation.vendor?.user?.id === vendor.userId
    );

  const conversation =
    existingConversation ??
    (
      await messageService.createConversation(
        vendor.backendId ?? vendor.id.toString()
      )
    ).data;

  if (!conversation?.id) {
    toast.error(
      "Unable to start conversation."
    );
    return;
  }

  if (!existingConversation) {
    await sendNewMessage(
      conversation.id,
      vendor.userId,
      "Hello! I'm interested in your services."
    );

    await loadConversations();
  }

 setSelectedConversation(conversation.id);

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
