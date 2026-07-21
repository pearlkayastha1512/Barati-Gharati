"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface BookingSuccessProps {
  bookingId: string;
  vendorName: string;
  date: string;
  eventType: string;
  onClose: () => void;
}

export default function BookingSuccess({
  bookingId,
  vendorName,
  date,
  eventType,
  onClose,
}: BookingSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="p-10 text-center"
    >
      <CheckCircle2 className="mx-auto h-24 w-24 text-green-500" />

      <h2 className="mt-6 text-4xl font-bold text-gray-900">
        Booking Request Sent!
      </h2>

      <p className="mt-2 text-gray-600 ">
        Your request for <b>{vendorName}</b> has been sent. The vendor has 2 hours to accept your booking request.
      </p>

      <div className="mt-10 rounded-2xl bg-gray-50 p-6 text-left">
        <div className="mb-5">
          <p className="text-sm text-gray-500">Booking ID</p>
          <p className="text-2xl font-bold text-rose-600">#{bookingId}</p>
        </div>

        <div className="mb-5">
          <p className="text-sm text-gray-500">Vendor</p>
          <p className="font-semibold text-rose-500">{vendorName}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">{eventType} Date</p>
          <p className="font-semibold text-rose-500">{date}</p>
        </div>
      </div>

      <p className="mt-8 text-gray-600">
        Once the vendor accepts your request, you will be notified to pay the advance payment to lock your date.
      </p>

      <button
        onClick={onClose}
        className="mt-8 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-3 font-semibold text-white transition hover:opacity-90"
      >
        Back to Vendor
      </button>

    </motion.div>
  );
}
