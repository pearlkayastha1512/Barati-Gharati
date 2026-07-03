// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import {
//   CalendarDays,
//   Clock3,
//   MapPin,
//   IndianRupee,
//   MessageCircle,
//   FileText,
//   Eye,
//   Star,
// } from "lucide-react";

// import { useState } from "react";

// import {
  
//   CreditCard,
// } from "lucide-react";

// import PayAdvanceModal from "./PayAdvanceModal";

// import { Booking } from "@/types/booking";

// interface BookingCardProps {
//   booking: Booking;
// }

// export default function BookingCard({
//   booking,
// }: BookingCardProps) {

//   const [openPayment, setOpenPayment] =
//   useState(false);
//   const statusColor = {
//     pending:
//       "bg-yellow-100 text-yellow-700",

//     accepted:
//       "bg-green-100 text-green-700",

//     completed:
//       "bg-blue-100 text-blue-700",

//     cancelled:
//       "bg-red-100 text-red-700",
//   };

//   return (
//     <div
//       className="
//         rounded-3xl
//         border
//         border-gray-200
//         bg-white
//         p-6
//         shadow-sm
//         transition-all
//         duration-300
//         hover:-translate-y-1
//         hover:shadow-xl
//       "
//     >
//       <div className="flex flex-col gap-6 lg:flex-row">

//         {/* Vendor Image */}

//         <div className="relative h-52 w-full overflow-hidden rounded-3xl lg:h-44 lg:w-72">

//           <Image
//             src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800"
//             alt={booking.vendorName}
//             fill
//             className="object-cover"
//           />

//         </div>

//         {/* Details */}

//         <div className="flex flex-1 flex-col justify-between">

//           <div>

//             <div className="flex flex-wrap items-center justify-between gap-4">

//               <div>

//                 <h2 className="text-2xl font-bold text-gray-900">
//                   {booking.vendorName}
//                 </h2>

//                 <p className="mt-1 text-gray-500">
//                   {booking.category}
//                 </p>

//               </div>

//               <span
//                 className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${statusColor[booking.bookingStatus]}`}
//               >
//                 {booking.bookingStatus}
//               </span>

//             </div>

//             <div className="mt-6 grid gap-4 md:grid-cols-2">

//               <div className="flex items-center gap-3">

//                 <CalendarDays
//                   size={18}
//                   className="text-indigo-500"
//                 />

//                 <span className="text-gray-700">
//                   {booking.eventDate}
//                 </span>

//               </div>

//               <div className="flex items-center gap-3">

//                 <Clock3
//                   size={18}
//                   className="text-indigo-500"
//                 />

//                 <span className="text-gray-700">
//                   {booking.eventTime || "--"}
//                 </span>

//               </div>

//               <div className="flex items-center gap-3">

//                 <MapPin
//                   size={18}
//                   className="text-indigo-500"
//                 />

//                 <span className="text-gray-700">
//                   {booking.city || "--"}
//                 </span>

//               </div>

//               <div className="flex items-center gap-3">

//                 <IndianRupee
//                   size={18}
//                   className="text-indigo-500"
//                 />

//                 <span className="text-gray-700">
//                   ₹{booking.amount.toLocaleString("en-IN")}
//                 </span>

//               </div>

//             </div>

//           </div>

//           {/* Bottom */}

//           <div className="mt-8 flex flex-wrap gap-3">

//             <Link
//               href={`/customer/bookings/${booking.id}`}
//               className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
//             >
//               <Eye size={18} />

//               View Details
//             </Link>

//             <button className="flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 font-medium transition hover:bg-gray-50">

//               <MessageCircle size={18} />

//               Chat

//             </button>

//             <button className="flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-3 font-medium transition hover:bg-gray-50">

//               <FileText size={18} />

//               Invoice

//             </button>



//             {booking.bookingStatus === "completed" && (
//   <button
//     className="
//       flex
//       items-center
//       gap-2
//       rounded-2xl
//       bg-amber-500
//       px-5
//       py-3
//       font-semibold
//       text-white
//       transition
//       hover:bg-amber-600
//     "
//   >
//     <Star size={18} />

//     Leave Review
//   </button>
// )}

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }


"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  CalendarDays,
  Clock3,
  MapPin,
  IndianRupee,
  MessageCircle,
  FileText,
  Eye,
  Star,
  CreditCard,
} from "lucide-react";

import PayAdvanceModal from "./PayAdvanceModal";

import { Booking } from "@/types/booking";

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({
  booking,
}: BookingCardProps) {
  const [openPayment, setOpenPayment] =
    useState(false);

  const statusColor = {
    pending:
      "bg-yellow-100 text-yellow-700",

    accepted:
      "bg-green-100 text-green-700",

    completed:
      "bg-blue-100 text-blue-700",

    cancelled:
      "bg-red-100 text-red-700",
  };

  return (
    <>
      <div
        className="
          rounded-3xl
          border
          border-gray-200
          bg-white
          p-6
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Vendor Image */}

          <div className="relative h-52 w-full overflow-hidden rounded-3xl lg:h-44 lg:w-72">
            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800"
              alt={booking.vendorName}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}

          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {booking.vendorName}
                  </h2>

                  <p className="mt-1 text-gray-500">
                    {booking.category}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${statusColor[booking.bookingStatus]}`}
                >
                  {booking.bookingStatus}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <CalendarDays
                    size={18}
                    className="text-indigo-500"
                  />

                  <span className="text-gray-700">
                    {booking.eventDate}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock3
                    size={18}
                    className="text-indigo-500"
                  />

                  <span className="text-gray-700">
                    {booking.eventTime || "--"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin
                    size={18}
                    className="text-indigo-500"
                  />

                  <span className="text-gray-700">
                    {booking.city || "--"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <IndianRupee
                    size={18}
                    className="text-indigo-500"
                  />

                  <span className="text-gray-700">
                    ₹{booking.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Payment Section */}

              <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-500">
                      Total Amount
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      ₹{booking.amount.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Advance Paid
                    </p>

                    <p className="mt-1 font-semibold text-green-600">
                      ₹
                      {booking.advancePaid.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Remaining
                    </p>

                    <p className="mt-1 font-semibold text-red-500">
                      ₹
                      {booking.remainingAmount.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                </div>



                {/* <button
                  disabled={
                    booking.paymentStatus ===
                    "paid"
                  }
                  onClick={() =>
                    setOpenPayment(true)
                  }
                  className={`
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    py-3
                    font-semibold
                    transition

                    ${
                      booking.paymentStatus ===
                      "paid"
                        ? "cursor-not-allowed bg-green-100 text-green-700"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }
                  `}
                >
                  <CreditCard size={18} />

                  {booking.paymentStatus ===
                  "paid"
                    ? "Payment Completed"
                    : "Pay Advance"}
                </button> */}




<button
  disabled={
    booking.paymentStatus === "paid" ||
    booking.bookingStatus === "cancelled"
  }
  onClick={() => setOpenPayment(true)}
  className={`
    mt-5
    flex
    w-full
    items-center
    justify-center
    gap-2
    rounded-2xl
    py-3
    font-semibold
    transition

    ${
      booking.paymentStatus === "paid" ||
      booking.bookingStatus === "cancelled"
        ? "cursor-not-allowed bg-gray-200 text-gray-500"
        : "bg-indigo-600 text-white hover:bg-indigo-700"
    }
  `}
>
  <CreditCard size={18} />

  {booking.bookingStatus === "cancelled"
    ? "Booking Cancelled"
    : booking.paymentStatus === "paid"
    ? "Payment Completed"
    : "Pay Advance"}
</button>








              </div>
            </div>

            {/* Bottom Actions */}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/customer/bookings/${booking.id}`}
                className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                <Eye size={18} />

                View Details
              </Link>

              

              {booking.bookingStatus ===
                "completed" && (
                <button
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-amber-500
                    px-5
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-amber-600
                  "
                >
                  <Star size={18} />

                  Leave Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <PayAdvanceModal
        booking={booking}
        open={openPayment}
        onClose={() =>
          setOpenPayment(false)
        }
      />
    </>
  );
}