

"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import BookingSuccess from "./BookingSuccess";
import AdvancePaymentStep from "./AdvancePaymentStep";
import { useAuthStore } from "@/store/authStore";


// import { useBookingStore } from "@/store/bookingStore";
import { Booking } from "@/types/booking";
import {
  AGE_RELEVANT_EVENT_TYPES,
  COUPLE_EVENT_TYPES,
  EVENT_TYPES,
  EventType,
} from "@/constants/event-types";

import { toast } from "sonner";


// import { useNotificationStore } from "@/store/notificationStore";
// import { paymentService } from "@/services/payment.service";

// import { emailService } from "@/services/email.service";


// import {
//   isDateBlocked,
//   isDateBooked,
// } from "@/services/availability.service";


import {
  createBooking,
} from "@/services/booking.service";





interface BookingModalProps {
  open: boolean;

  onClose: () => void;

  vendorId: number;

  vendorName: string;

  category: string;

  city: string;

  packageName: string;

  price: number;

  guests: number;

  date: string;
}

function createBookingNumber() {
  return `WD${new Date().getFullYear()}${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export default function BookingModal({
  open,
  onClose,
  vendorId,
  vendorName,
  category,
  city,
  packageName,
  price,
  guests,
  date,
}: BookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentBooking, setPaymentBooking] =
    useState<Booking | null>(null);

  const [bookingId, setBookingId] = useState("");

  const { user } = useAuthStore();
// const { addBooking } = useBookingStore();

// const { addNotification } =
//   useNotificationStore();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () =>
      window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) {
      setLoading(false);
      setSuccess(false);
      setPaymentBooking(null);
    }
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

const handleBooking = async () => {
  if (!user) return;

  const eventDate =
    getIsoEventDate(date);

  if (!eventDate) {
    toast.error(
      "Please select a valid event date."
    );
    return;
  }

  if (!isFormValid) {
    toast.error("Please fill all required fields.");
    return;
  }

  setLoading(true);

  const bookingNumber = createBookingNumber();

  const booking: Booking = {
    id: "",

    bookingNumber,

	 customerId: user._id,

    vendorId,

    customerName: user.name,

    customerEmail: formData.email,

    customerPhone: formData.phone,

    partnerName: getPartnerName(),

    partnerEmail: formData.partnerEmail,

    partnerPhone: formData.partnerPhone,

    partnerOccupation:
      formData.partnerOccupation,

    vendorName,

    category,

    packageName,

    eventType: formData.eventType,

    eventDate,

    eventTime: "",

    venue: vendorName,

    city,

    contactAddress:
      formData.address,

    contactState: formData.state,

    contactCountry:
      formData.country,

    weddingTheme:
      formData.eventTheme,

    guests,

    brideName: formData.brideName,

    groomName: formData.groomName,

    eventTitle: formData.eventTitle,

    primaryPersonName:
      formData.primaryPersonName,

    primaryPersonAge:
      formData.primaryPersonAge
        ? Number(formData.primaryPersonAge)
        : undefined,

    eventTheme: formData.eventTheme,

    specialRequirements:
      formData.requirements,

    amount: price,

    advancePaid: 0,

    remainingAmount: price,

    paymentStatus: "pending",

      bookingStatus: "pending",

    createdAt: "",

    updatedAt: "",
  };

  const result =
    await createBooking(booking);

  setLoading(false);

  if (!result.ok) {
    toast.error(
      result.error ??
        "Unable to create booking."
    );

    return;
  }

  setBookingId(bookingNumber);

  if (!result.data?.id) {
    toast.error(
      "Booking created, but payment could not be started."
    );
    return;
  }

  setPaymentBooking(result.data);

  toast.success(
    "Booking details saved. Please pay the required advance."
  );
};




// const handlePaymentSuccess = () => {
//   if (!user) return;

//   const bookingNumber =
//     "WD" +
//     new Date().getFullYear() +
//     Math.floor(
//       100000 + Math.random() * 900000
//     );

//   setBookingId(bookingNumber);

//   const booking: Booking = {
//     id: crypto.randomUUID(),

//     bookingNumber,

//     customerId: user._id,

//     vendorId,

//     customerName: user.name,

//     customerEmail: formData.email,

//     customerPhone: formData.phone,

//     vendorName,

//     category,

//     packageName,

//     eventType: "Wedding",

//     eventDate: date,

//     eventTime: "",

//     venue: vendorName,

//     city,

//     guests,

//     brideName: formData.brideName,

//     groomName: formData.groomName,

//     specialRequirements:
//       formData.requirements,

//     amount: price,

//     // 25% advance payment
//     advancePaid: price * 0.25,

//     remainingAmount:
//       price - price * 0.25,

//     paymentStatus: "partial",

//     bookingStatus: "pending",

//     createdAt: new Date().toISOString(),

//     updatedAt: new Date().toISOString(),
//   };

//  const payment =
//   paymentService.processPayment({
//     amount: booking.advancePaid,
//   });

// if (!payment.success) {
//   toast.error(
//     "Payment failed."
//   );

//   return;
// }

//   addBooking(booking);




//   emailService.sendEmail(
//   booking.customerEmail,
//   "Booking Confirmation",
//   `
// Hi ${booking.customerName},

// Your booking for ${booking.vendorName}
// has been confirmed.

// Booking ID:
// ${booking.bookingNumber}

// Advance Paid:
// ₹${booking.advancePaid}

// Remaining:
// ₹${booking.remainingAmount}

// Thank you.
// `
// );

// toast.success(
//   "Confirmation email sent."
// );

//   const vendor = getVendorById(vendorId);

//   if (vendor) {
//     addNotification({
//       id: crypto.randomUUID(),

//       userId: user._id,

//       title: "Booking Submitted",

//       message: `Your booking request for ${vendorName} has been submitted.`,

//       type: "booking",

//       link: "/customer/bookings",

//       isRead: false,

//       createdAt: new Date().toISOString(),
//     });

//     addNotification({
//       id: crypto.randomUUID(),

//       userId: vendor.userId,

//       title: "New Booking",

//       message: `${user.name} booked your ${category} service.`,

//       type: "booking",

//       link: "/vendor/bookings",

//       isRead: false,

//       createdAt: new Date().toISOString(),
//     });
//   }

//   toast.success(
//     "Advance payment successful."
//   );

//   toast.success(
//     "Confirmation email sent."
//   );

//   setPaymentOpen(false);

//   setSuccess(true);
// };
const [formData, setFormData] = useState({
  eventType: "Wedding" as EventType,
  eventTitle: "",
  primaryPersonName: "",
  primaryPersonAge: "",
  brideName: "",
  groomName: "",
  phone: "",
  email: "",
  partnerEmail: "",
  partnerPhone: "",
  partnerOccupation: "",
  address: "",
  state: "",
  country: "",
  eventTheme: "",
  requirements: "",
});

const isCoupleEvent =
  COUPLE_EVENT_TYPES.includes(
    formData.eventType
  );

const showsAge =
  AGE_RELEVANT_EVENT_TYPES.includes(
    formData.eventType
  );

const getPartnerName = () => {
  const customerName =
    user?.name.trim().toLowerCase();
  const brideName =
    formData.brideName.trim();
  const groomName =
    formData.groomName.trim();

  if (
    customerName &&
    brideName.toLowerCase() ===
      customerName
  ) {
    return groomName;
  }

  if (
    customerName &&
    groomName.toLowerCase() ===
      customerName
  ) {
    return brideName;
  }

  return groomName || brideName;
};

const getIsoEventDate = (
  value: string
) => {
  if (!value) {
    return "";
  }

  const dateValue = new Date(
    `${value}T00:00:00.000Z`
  );

  if (Number.isNaN(dateValue.getTime())) {
    return "";
  }

  return dateValue.toISOString();
};

const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement |
    HTMLTextAreaElement |
    HTMLSelectElement
  >
) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};


const isFormValid =
  formData.primaryPersonName.trim() !== "" &&
  formData.phone.trim() !== "" &&
  formData.email.trim() !== "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 40,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            {success ? (
  <BookingSuccess
    bookingId={bookingId}
    vendorName={vendorName}
    date={date}
    eventType={formData.eventType}
    onClose={onClose}
  />
) : paymentBooking ? (
  <AdvancePaymentStep
    bookingId={paymentBooking.id}
    bookingNumber={paymentBooking.bookingNumber}
    vendorName={vendorName}
    customerName={paymentBooking.customerName}
    customerEmail={paymentBooking.customerEmail}
    customerPhone={paymentBooking.customerPhone}
    onPaid={() => setSuccess(true)}
  />
) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-5">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Book Vendor
                    </h2>

                    <p className="mt-1 text-gray-600">
                      Complete your booking details for{" "}
                      <span className="font-semibold text-rose-600">
                        {vendorName}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="rounded-full p-2 transition hover:bg-gray-100"
                  >
                    <X className="h-6 w-6 text-gray-700" />
                  </button>
                </div>

                {/* Body */}
                <div className="grid gap-5 p-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Event Type
                    </label>

                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-700 focus:border-rose-500 focus:outline-none"
                    >
                      {EVENT_TYPES.map((eventType) => (
                        <option
                          key={eventType}
                          value={eventType}
                        >
                          {eventType}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Celebrant / Primary Person
                    </label>

                    <input
                      type="text"
                      placeholder="Name of the person being celebrated"
                      name="primaryPersonName"
                      value={formData.primaryPersonName}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-gray-300 px-4 text-gray-500 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Event Title
                    </label>

                    <input
                      type="text"
                      placeholder="Aarav's Birthday, Office Annual Party..."
                      name="eventTitle"
                      value={formData.eventTitle}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-gray-300 px-4 text-gray-500 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  {showsAge && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Age (Optional)
                      </label>

                      <input
                        type="number"
                        min="0"
                        max="150"
                        placeholder="Age"
                        name="primaryPersonAge"
                        value={formData.primaryPersonAge}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border border-gray-300 px-4 text-gray-500 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      📞 Phone
                    </label>

                    <input
                      type="tel"
                      placeholder="Phone Number"
                      name="phone"
  value={formData.phone}
  onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-gray-300 px-4 text-gray-500 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      📧 Email
                    </label>

                    <input
                      type="email"
                      placeholder="Email Address"
                       name="email"
  value={formData.email}
  onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-gray-300 px-4 text-gray-500 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  {isCoupleEvent && (
                    <>
                      <div className="md:col-span-2 border-t border-gray-200 pt-4">
                        <p className="font-semibold text-gray-900">
                          Couple Details
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Optional for this booking
                        </p>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Bride Name (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Bride Name"
                          name="brideName"
                          value={formData.brideName}
                          onChange={handleChange}
                          className="h-11 w-full rounded-xl border border-gray-300 px-4 text-gray-500 focus:border-rose-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Groom Name (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Groom Name"
                          name="groomName"
                          value={formData.groomName}
                          onChange={handleChange}
                          className="h-11 w-full rounded-xl border border-gray-300 px-4 text-gray-500 focus:border-rose-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Partner Email (Optional)
                        </label>
                        <input
                          type="email"
                          placeholder="Partner Email"
                          name="partnerEmail"
                          value={formData.partnerEmail}
                          onChange={handleChange}
                          className="h-11 w-full rounded-xl border border-gray-300 px-4 text-gray-500 focus:border-rose-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Partner Phone (Optional)
                        </label>
                        <input
                          type="tel"
                          placeholder="Partner Phone"
                          name="partnerPhone"
                          value={formData.partnerPhone}
                          onChange={handleChange}
                          className="h-11 w-full rounded-xl border border-gray-300 px-4 text-gray-500 focus:border-rose-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Partner Occupation (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Partner Occupation"
                          name="partnerOccupation"
                          value={formData.partnerOccupation}
                          onChange={handleChange}
                          className="h-11 w-full rounded-xl border border-gray-300 px-4 text-gray-500 focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Event Theme (Optional)
                    </label>

                    <input
                      type="text"
                      placeholder="Traditional, superhero, floral, minimal..."
                      name="eventTheme"
                      value={formData.eventTheme}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-gray-300 px-4 text-gray-500 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Event Date
                    </label>

                    <input
                      value={date}
                      readOnly
                      className="h-11 w-full rounded-xl border bg-gray-100 px-4 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      📦 Package
                    </label>

                    <input
                      value={packageName}
                      readOnly
                      className="h-11 w-full rounded-xl border bg-gray-100 px-4 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      👥 Guests
                    </label>

                    <input
                      value={guests}
                      readOnly
                      className="h-11 w-full rounded-xl border bg-gray-100 px-4 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      🏛 Vendor
                    </label>

                    <input
                      value={vendorName}
                      readOnly
                      className="h-11 w-full rounded-xl border bg-gray-100 px-4 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Address
                    </label>

                    <input
                      type="text"
                      placeholder="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-gray-300 px-4 text-gray-500 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      State
                    </label>

                    <input
                      type="text"
                      placeholder="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-gray-300 px-4 text-gray-500 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Country
                    </label>

                    <input
                      type="text"
                      placeholder="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-gray-300 px-4 text-gray-500 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Special Requirements
                    </label>

                    <textarea
                      rows={3}
                      placeholder="Decoration, catering, entertainment, accessibility..."
                       name="requirements"
  value={formData.requirements}
  onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 p-4 focus:border-rose-500 focus:outline-none text-gray-500"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 border-t bg-white px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-700">
                      Estimated Price
                    </span>

                    <span className="text-3xl font-bold text-rose-600">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
  onClick={handleBooking}
  disabled={loading || !isFormValid}
  className="
    w-full
    rounded-xl
    bg-gradient-to-r
    from-rose-500
    to-pink-500
    py-3.5
    text-lg
    font-semibold
    text-white
    transition-all
    duration-300
    hover:scale-[1.01]
    hover:shadow-lg
    disabled:cursor-not-allowed
    disabled:opacity-50
    disabled:hover:scale-100
    disabled:hover:shadow-none
  "
>
  {loading ? (
    <div className="flex items-center justify-center gap-3">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      Processing...
    </div>
  ) : !isFormValid ? (
    "Fill all required fields"
  ) : (
    "Confirm Booking"
  )}
</button>
{!isFormValid && (
  <p className="mt-2 text-center text-sm text-red-500">
    Please fill in Bride Name, Groom Name, Phone, and Email to continue.
  </p>
)}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* <PaymentModal
  open={paymentOpen}
  amount={price * 0.25}
  onClose={() => setPaymentOpen(false)}
  onSuccess={handlePaymentSuccess}
/> */}
    </AnimatePresence>
  );
}
