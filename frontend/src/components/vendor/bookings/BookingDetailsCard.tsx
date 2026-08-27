"use client";

import { useState } from "react";
import {
  CalendarDays,
  MapPin,
  Phone,
  Wallet,
  User,
  Tag,
  Clock,
  Users,
  FileText,
  AlertTriangle,
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";
import { useVendorProfile } from "@/hooks/useVendorProfile";
import StatusBadge from "@/components/ui/StatusBadge";
import { toast } from "sonner";
import VendorRejectionModal from "@/components/vendors/VendorRejectionModal";

export default function BookingDetailsCard() {
  const { vendor } = useVendorProfile();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isPromotedReject, setIsPromotedReject] = useState(false);
  const {
    selectedBooking,
    updateStatus,
  } = useBookingStore();

  const handleConfirmRejection = async (reason: string) => {
    if (!selectedBooking) return;
    if (isPromotedReject) {
      await useBookingStore.getState().promotedReject(selectedBooking.id, reason);
    } else {
      await useBookingStore.getState().primaryReject(selectedBooking.id, reason);
    }
    toast.success("Rejection reason submitted.");
  };

  const [pendingResponse, setPendingResponse] = useState<{
    response: "AVAILABLE" | "NOT_AVAILABLE";
  } | null>(null);

  if (!selectedBooking) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">

        <h2 className="text-2xl font-bold text-slate-900">
          Booking Details
        </h2>

        <div className="mt-12 text-center">

          <p className="text-lg font-medium text-slate-700">
            No Booking Selected
          </p>

          <p className="mt-2 text-slate-500">
            Click the
            <span className="font-semibold">
              {" "}View{" "}
            </span>
            button in the table to view booking details.
          </p>

        </div>

      </section>
    );
  }

  const myAssignment = vendor
    ? selectedBooking.vendorAssignments?.find(
        (a) =>
          String(a.vendorId) === String(vendor.id) ||
          a.vendorId === vendor.userId
      )
    : null;

  const isStandbyVendor =
    myAssignment?.role === "STANDBY" ||
    (selectedBooking.vendorAssignments?.some((a) => a.role === "STANDBY") &&
      selectedBooking.vendorId !== vendor?.id);

  const isPrimaryVendor = !isStandbyVendor;

  const isAvailable =
    myAssignment?.status === "AVAILABLE" ||
    (!myAssignment && selectedBooking.vendorAssignments?.some((a) => a.status === "AVAILABLE"));

  const isNotAvailable =
    myAssignment?.status === "NOT_AVAILABLE" ||
    (!myAssignment && selectedBooking.vendorAssignments?.some((a) => a.status === "NOT_AVAILABLE"));

  const hasResponded = isAvailable || isNotAvailable;

  const canViewCustomerContact =
    Boolean(selectedBooking.adminApproved);

  const hasPeopleDetails =
    canViewCustomerContact &&
    Boolean(
      selectedBooking.primaryPersonName ||
        selectedBooking.brideName ||
        selectedBooking.groomName ||
        selectedBooking.partnerName ||
        selectedBooking.partnerEmail ||
        selectedBooking.partnerPhone ||
        selectedBooking.partnerOccupation
    );

  const hasLocationDetails = Boolean(
    selectedBooking.city ||
      selectedBooking.contactAddress ||
      selectedBooking.contactState ||
      selectedBooking.contactCountry
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Booking Details
        </h2>
        <StatusBadge status={selectedBooking.bookingStatus} size="md" />
      </div>


      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <Item
          icon={<User size={18} />}
          label="Customer"
          value={selectedBooking.customerName}
        />

        <Item
          icon={<Tag size={18} />}
          label="Event Type"
          value={selectedBooking.eventType}
        />

        {canViewCustomerContact &&
          selectedBooking.primaryPersonName && (
          <Item
            icon={<User size={18} />}
            label="Celebrant / Primary Person"
            value={selectedBooking.primaryPersonName}
          />
        )}

        <Item
          icon={<Phone size={18} />}
          label="Phone"
          value={
            canViewCustomerContact &&
            selectedBooking.customerPhone
              ? selectedBooking.customerPhone
              : "Hidden until admin approval"
          }
        />

        <Item
          icon={<CalendarDays size={18} />}
          label="Event Date(s)"
          value={
            selectedBooking.eventDates && selectedBooking.eventDates.length > 0
              ? selectedBooking.eventDates
                  .map((d) =>
                    new Date(d.includes("T") ? d : d + "T00:00:00").toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  )
                  .join(", ") + ` (${selectedBooking.eventDates.length} Days)`
              : new Date(selectedBooking.eventDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
          }
        />

        <Item
          icon={<MapPin size={18} />}
          label="Venue"
          value={selectedBooking.venue}
        />

        <Item
          icon={<Tag size={18} />}
          label="Package"
          value={selectedBooking.packageName}
        />

        <Item
          icon={<Wallet size={18} />}
          label="Total Amount"
          value={`₹${selectedBooking.amount.toLocaleString(
            "en-IN"
          )}`}
        />

        <Item
          icon={<Wallet size={18} />}
          label="Customer Advance"
          value={`₹${selectedBooking.advancePaid.toLocaleString(
            "en-IN"
          )}`}
        />

        <Item
          icon={<Wallet size={18} />}
          label="Platform Fee"
          value={`- ₹${(selectedBooking.platformCommission ?? 0).toLocaleString(
            "en-IN"
          )}`}
        />

        <Item
          icon={<Wallet size={18} />}
          label="Your Net Advance"
          value={`₹${(selectedBooking.vendorNetAmount ?? 0).toLocaleString(
            "en-IN"
          )}`}
        />

        <Item
          icon={<Wallet size={18} />}
          label="Release Status"
          value={
            selectedBooking.payoutStatus?.replaceAll("_", " ") ??
            "Pending"
          }
        />

        <Item
          icon={<Wallet size={18} />}
          label="Remaining"
          value={`₹${selectedBooking.remainingAmount.toLocaleString(
            "en-IN"
          )}`}
        />

      </div>

      {!canViewCustomerContact && (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
          Customer contact details will unlock after admin approves this booking.
        </div>
      )}

      {canViewCustomerContact &&
        !selectedBooking.vendorAcknowledgedAt && (
          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            Admin released your net advance in the test ledger. Acknowledge and accept this booking to continue.
          </div>
        )}

      <DetailsSection title="Event Details">
        <Item
          icon={<Users size={18} />}
          label="Guests"
          value={selectedBooking.guests.toLocaleString(
            "en-IN"
          )}
        />

        {selectedBooking.eventTime && (
          <Item
            icon={<Clock size={18} />}
            label="Event Time"
            value={selectedBooking.eventTime}
          />
        )}

        {selectedBooking.eventTitle && (
          <Item
            icon={<FileText size={18} />}
            label="Event Title"
            value={selectedBooking.eventTitle}
          />
        )}

        {(selectedBooking.eventTheme ||
          selectedBooking.weddingTheme) && (
          <Item
            icon={<FileText size={18} />}
            label="Theme"
            value={
              selectedBooking.eventTheme ||
              selectedBooking.weddingTheme ||
              ""
            }
          />
        )}
      </DetailsSection>

      {hasPeopleDetails && (
        <DetailsSection title="People Details">
          {selectedBooking.primaryPersonName && (
            <Item
              icon={<User size={18} />}
              label="Primary Person"
              value={
                selectedBooking.primaryPersonAge
                  ? `${selectedBooking.primaryPersonName} (${selectedBooking.primaryPersonAge})`
                  : selectedBooking.primaryPersonName
              }
            />
          )}

          {selectedBooking.brideName && (
            <Item
              icon={<User size={18} />}
              label="Bride Name"
              value={selectedBooking.brideName}
            />
          )}

          {selectedBooking.groomName && (
            <Item
              icon={<User size={18} />}
              label="Groom Name"
              value={selectedBooking.groomName}
            />
          )}

          {selectedBooking.partnerName && (
            <Item
              icon={<User size={18} />}
              label="Partner Name"
              value={selectedBooking.partnerName}
            />
          )}

          {selectedBooking.partnerPhone && (
            <Item
              icon={<Phone size={18} />}
              label="Partner Phone"
              value={selectedBooking.partnerPhone}
            />
          )}

          {selectedBooking.partnerEmail && (
            <Item
              icon={<FileText size={18} />}
              label="Partner Email"
              value={selectedBooking.partnerEmail}
            />
          )}

          {selectedBooking.partnerOccupation && (
            <Item
              icon={<FileText size={18} />}
              label="Partner Occupation"
              value={selectedBooking.partnerOccupation}
            />
          )}
        </DetailsSection>
      )}

      {hasLocationDetails && (
        <DetailsSection title="Location Details">
          {selectedBooking.city && (
            <Item
              icon={<MapPin size={18} />}
              label="City"
              value={selectedBooking.city}
            />
          )}

          {canViewCustomerContact &&
            selectedBooking.contactAddress && (
            <Item
              icon={<MapPin size={18} />}
              label="Contact Address"
              value={selectedBooking.contactAddress}
            />
          )}

          {canViewCustomerContact &&
            selectedBooking.contactState && (
            <Item
              icon={<MapPin size={18} />}
              label="State"
              value={selectedBooking.contactState}
            />
          )}

          {canViewCustomerContact &&
            selectedBooking.contactCountry && (
            <Item
              icon={<MapPin size={18} />}
              label="Country"
              value={selectedBooking.contactCountry}
            />
          )}
        </DetailsSection>
      )}

      {selectedBooking.specialRequirements && (
        <div className="mt-8 rounded-2xl bg-rose-50 p-5">
          <div className="flex items-center gap-3 text-[#e4005a]">
            <FileText size={18} />
            <h3 className="font-semibold text-slate-900">
              Special Requirements
            </h3>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {selectedBooking.specialRequirements}
          </p>
        </div>
      )}

      {isPrimaryVendor &&
        (selectedBooking.bookingStatus === "waiting_primary_vendor" ||
          selectedBooking.bookingStatus === "pending") && (
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => useBookingStore.getState().primaryAccept(selectedBooking.id)}
            className="rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Accept Booking (Primary)
          </button>

          <button
            onClick={() => {
              setIsPromotedReject(false);
              setIsRejectModalOpen(true);
            }}
            className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Reject Booking
          </button>
        </div>
      )}

      {selectedBooking.bookingStatus === "promote_standby" && (
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => useBookingStore.getState().promotedAccept(selectedBooking.id)}
            className="rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Accept Promoted Booking
          </button>

          <button
            onClick={() => {
              setIsPromotedReject(true);
              setIsRejectModalOpen(true);
            }}
            className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Reject Promoted Booking
          </button>
        </div>
      )}

      {isStandbyVendor &&
        (selectedBooking.bookingStatus === "waiting_primary_vendor" ||
          selectedBooking.bookingStatus === "pending" ||
          selectedBooking.bookingStatus === "matching" ||
          selectedBooking.bookingStatus === "primary_rejected") && (
          <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5">
            <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
              📋 Standby Request — Confirm Your Availability
            </h4>
            <p className="mt-1 text-xs text-indigo-800 font-medium leading-relaxed">
              Please confirm your availability for this date. You will be able to accept this booking if the primary vendor rejects the request.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                disabled={hasResponded}
                onClick={() => {
                  if (hasResponded) {
                    toast.info("Availability status has already been confirmed and locked.");
                    return;
                  }
                  setPendingResponse({ response: "AVAILABLE" });
                }}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-200 shadow-sm ${
                  isAvailable
                    ? "bg-emerald-600 text-white ring-2 ring-emerald-400 ring-offset-1 scale-[1.02] opacity-100 font-extrabold shadow-emerald-200 cursor-default"
                    : isNotAvailable
                    ? "bg-emerald-100/80 text-emerald-800 opacity-40 grayscale blur-[0.4px] border border-emerald-300 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
                }`}
                title={hasResponded ? "Availability confirmed and locked" : "Confirm Availability for Event Date"}
              >
                ✓ I&apos;m Available
              </button>
              <button
                disabled={hasResponded}
                onClick={() => {
                  if (hasResponded) {
                    toast.info("Availability status has already been confirmed and locked.");
                    return;
                  }
                  setPendingResponse({ response: "NOT_AVAILABLE" });
                }}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-200 shadow-sm ${
                  isNotAvailable
                    ? "bg-rose-600 text-white ring-2 ring-rose-400 ring-offset-1 scale-[1.02] opacity-100 font-extrabold shadow-rose-200 cursor-default"
                    : isAvailable
                    ? "bg-rose-100/80 text-rose-800 opacity-40 grayscale blur-[0.4px] border border-rose-300 cursor-not-allowed"
                    : "bg-rose-600 text-white hover:bg-rose-700 active:scale-95"
                }`}
                title={hasResponded ? "Availability confirmed and locked" : "Mark as Not Available"}
              >
                ✕ Not Available
              </button>
            </div>
          </div>
        )}

      {(selectedBooking.bookingStatus === "advance_paid" ||
        selectedBooking.bookingStatus === "in_progress" ||
        selectedBooking.bookingStatus === "payment_approved" ||
        (selectedBooking.bookingStatus === "accepted" && selectedBooking.paymentStatus !== "pending")) && (
        <div className="mt-8 flex gap-4">
          <button
            onClick={() =>
              useBookingStore
                .getState()
                .updateStatus(selectedBooking.id, "event_completed")
            }
            className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Mark Event as Completed
          </button>
        </div>
      )}

      {/* Confirmation & Lock Modal */}
      {pendingResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Confirm Availability Status
                </h3>
                <p className="text-xs text-amber-700 font-semibold">
                  ⚠️ One-Time Action Only
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              You are marking yourself as{" "}
              <span className="font-extrabold text-slate-900 underline decoration-amber-400">
                {pendingResponse.response === "AVAILABLE" ? "AVAILABLE" : "NOT AVAILABLE"}
              </span>{" "}
              for this booking request.
            </p>

            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 font-medium leading-relaxed">
              <strong>Warning:</strong> Once you assure your availability status, <span className="underline font-bold text-amber-950">you cannot change it again</span>. Only one response submission is allowed per booking.
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPendingResponse(null)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const { response } = pendingResponse;
                  setPendingResponse(null);
                  const ok = await useBookingStore.getState().standbyRespond(selectedBooking.id, response);
                  if (ok) {
                    toast.success(`Availability locked as ${response === "AVAILABLE" ? "Available" : "Not Available"}`);
                  } else {
                    toast.error("Failed to update availability");
                  }
                }}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition ${
                  pendingResponse.response === "AVAILABLE"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                Confirm & Lock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Rejection Modal */}
      <VendorRejectionModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={handleConfirmRejection}
        title="Reject Booking Request"
      />
    </section>
  );
}

function DetailsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-slate-900">
        {title}
      </h3>

      <div className="mt-5 grid gap-6 md:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

function Item({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">

      <div className="rounded-xl bg-[#ffe1ec] p-3 text-[#e4005a]">
        {icon}
      </div>

      <div>

        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="font-semibold text-slate-900">
          {value}
        </p>

      </div>

    </div>
  );
}
