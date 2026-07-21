"use client";

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
} from "lucide-react";

import { useBookingStore } from "@/store/bookingStore";
import StatusBadge from "@/components/ui/StatusBadge";

export default function BookingDetailsCard() {
  const {
    selectedBooking,
    updateStatus,
  } = useBookingStore();

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
          label="Event Date"
          value={new Date(
            selectedBooking.eventDate
          ).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }
          )}
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

      {(selectedBooking.bookingStatus === "waiting_primary_vendor" ||
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
              const reason = prompt("Reason for rejection (optional):") ?? undefined;
              useBookingStore.getState().primaryReject(selectedBooking.id, reason);
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
              const reason = prompt("Reason for rejection (optional):") ?? undefined;
              useBookingStore.getState().promotedReject(selectedBooking.id, reason);
            }}
            className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Reject Promoted Booking
          </button>
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
