// "use client";

// import {
//   MessageCircle,
//   CalendarClock,
//   FileText,
//   AlertTriangle,
// } from "lucide-react";

// import { Booking } from "@/types/booking";
// import { generateInvoice } from "@/utils/generateInvoice";

// import { useBookingStore } from "@/store/bookingStore";
// import { toast } from "sonner";

// interface BookingActionsProps {
//   booking: Booking;
// }

// export default function BookingActions({
//   booking,
// }: BookingActionsProps) {

//   const { updateStatus } = useBookingStore();


//   const handleCancelBooking = () => {
//   const confirmed = window.confirm(
//     "Are you sure you want to cancel this booking?"
//   );

//   if (!confirmed) return;

//   updateStatus(booking.id, "cancelled");

//   toast.success("Booking cancelled successfully.");
// };
//   return (
//     <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
//       <h2 className="text-2xl font-bold text-gray-900">
//         Booking Actions
//       </h2>

//       <p className="mt-1 text-gray-500">
//         Manage your booking quickly.
//       </p>

//       <div className="mt-8 space-y-4">

//         {/* Chat */}

//         <button
//           className="flex w-full items-center justify-between rounded-2xl bg-indigo-600 px-5 py-4 font-semibold text-white transition hover:bg-indigo-700"
//         >
//           <div className="flex items-center gap-3">
//             <MessageCircle size={20} />
//             Chat with Vendor
//           </div>
//         </button>

//         {/* Invoice */}

//         <button
//           onClick={() => generateInvoice(booking)}
//           className="flex w-full items-center justify-between rounded-2xl border border-gray-200 px-5 py-4 text-gray-700 transition hover:bg-gray-50"
//         >
//           <div className="flex items-center gap-3">
//             <FileText size={20} />
//             Download Invoice
//           </div>
//         </button>

//         {/* Reschedule */}

//         <button
//           className="flex w-full items-center justify-between rounded-2xl border border-gray-200 px-5 py-4 text-gray-700 transition hover:bg-gray-50"
//         >
//           <div className="flex items-center gap-3">
//             <CalendarClock size={20} />
//             Reschedule Booking
//           </div>
//         </button>

//         {/* Cancel */}

//         <button
//   onClick={handleCancelBooking}
//   disabled={booking.bookingStatus === "cancelled"}
//   className={`
//     flex
//     w-full
//     items-center
//     justify-between
//     rounded-2xl
//     px-5
//     py-4
//     font-medium
//     transition

//     ${
//       booking.bookingStatus === "cancelled"
//         ? "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400"
//         : "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
//     }
//   `}
// >
//   <div className="flex items-center gap-3">
//     <AlertTriangle size={20} />

//     {booking.bookingStatus === "cancelled"
//       ? "Booking Cancelled"
//       : "Cancel Booking"}
//   </div>
// </button>

//       </div>
//     </section>
//   );
// }




"use client";

import {
  MessageCircle,
  CalendarClock,
  FileText,
  AlertTriangle,
} from "lucide-react";

import { Booking } from "@/types/booking";
import { generateInvoice } from "@/utils/generateInvoice";

import { useBookingStore } from "@/store/bookingStore";
import { toast } from "sonner";

interface BookingActionsProps {
  booking: Booking;
}

export default function BookingActions({
  booking,
}: BookingActionsProps) {
  const {
    bookings,
    updateStatus,
  } = useBookingStore();

  const currentBooking =
    bookings.find(
      (item) => item.id === booking.id
    ) ?? booking;

  const canCancel =
    currentBooking.bookingStatus ===
    "pending";

  const handleCancelBooking = () => {
    if (!canCancel) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    updateStatus(
      currentBooking.id,
      "cancelled"
    );

    toast.success(
      "Booking cancelled successfully."
    );
  };

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">

      <h2 className="text-2xl font-bold text-gray-900">
        Booking Actions
      </h2>

      <p className="mt-1 text-gray-500">
        Manage your booking quickly.
      </p>

      <div className="mt-8 space-y-4">

        {/* Chat */}

        {/* <button
          className="flex w-full items-center justify-between rounded-2xl bg-indigo-600 px-5 py-4 font-semibold text-white transition hover:bg-indigo-700"
        >
          <div className="flex items-center gap-3">
            <MessageCircle size={20} />
            Chat with Vendor
          </div>
        </button> */}

        Invoice

        <button
          onClick={() =>
            generateInvoice(currentBooking)
          }
          className="flex w-full items-center justify-between rounded-2xl border border-gray-200 px-5 py-4 text-gray-700 transition hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <FileText size={20} />
            Download Invoice
          </div>
        </button>

        {/* Reschedule */}

        <button
          className="flex w-full items-center justify-between rounded-2xl border border-gray-200 px-5 py-4 text-gray-700 transition hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <CalendarClock size={20} />
            Reschedule Booking
          </div>
        </button>

        {/* Cancel Booking */}

        <button
          onClick={handleCancelBooking}
          disabled={!canCancel}
          className={`
            flex
            w-full
            items-center
            justify-between
            rounded-2xl
            px-5
            py-4
            font-medium
            transition

            ${
              canCancel
                ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                : "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400"
            }
          `}
        >
          <div className="flex items-center gap-3">

            <AlertTriangle size={20} />

            {currentBooking.bookingStatus ===
            "cancelled"
              ? "Booking Cancelled"
              : currentBooking.bookingStatus ===
                "pending"
              ? "Cancel Booking"
              : "Cancellation Unavailable"}

          </div>

        </button>

      </div>

    </section>
  );
}