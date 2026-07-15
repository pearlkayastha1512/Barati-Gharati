"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { StoredVendor } from "@/services/vendor.service";
import {
  VendorBadge,
  VENDOR_BADGE_COLORS,
  VENDOR_BADGE_LABELS,
  VENDOR_BADGE_LIMITS,
} from "@/constants/vendor-badges";
import { isSupportedImageSrc } from "@/lib/image-url";
import { useAuthStore } from "@/store/authStore";
import { hasAdminPermission } from "@/lib/adminAccess";

interface Props {
  vendor: StoredVendor | null;

  open: boolean;

  onClose: () => void;

  onApprove: (vendorId: string | number) => void;

  onReject: (vendorId: string | number) => void;

  onBadgeChange: (
    vendorId: string | number,
    badge: VendorBadge
  ) => void;
}

export default function VendorDetailsModal({
  vendor,
  open,
  onClose,
  onApprove,
  onReject,
  onBadgeChange,
}: Props) {
  const user = useAuthStore((state) => state.user);
  const canManage = hasAdminPermission(user, "vendors.manage");
  if (!open || !vendor) {
    return null;
  }

  const isApproved =
    vendor.approvalStatus === "approved";
  const monthlyBookingLimitLabel = isApproved
    ? `${vendor.currentMonthBookings}/${vendor.monthlyBookingLimit}`
    : "Inactive until approval";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-3xl font-bold text-gray-700">
            Vendor Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X />
          </button>
        </div>

        <div className="space-y-8 p-8 text-gray-600">
          {/* Profile */}

          <div className="flex items-center gap-6">
            <div className="relative h-28 w-28 overflow-hidden rounded-3xl bg-gray-100">
              {isSupportedImageSrc(vendor.profileImage) ? (
                <Image
                  src={vendor.profileImage}
                  alt={vendor.businessName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl font-bold text-gray-400">
                  {vendor.businessName.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-700">
                {vendor.businessName}
              </h2>

              <p className="mt-2 text-gray-500">
                {vendor.ownerName}
              </p>

              <div className="mt-4">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    vendor.approvalStatus === "approved"
                      ? "bg-green-100 text-green-700"
                      : vendor.approvalStatus === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {vendor.approvalStatus === "approved"
                    ? "Approved"
                    : vendor.approvalStatus === "rejected"
                    ? "Rejected"
                    : "Pending"}
                </span>
              </div>

              <div className="mt-3">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    isApproved
                      ? VENDOR_BADGE_COLORS[vendor.badge]
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {isApproved
                    ? `${VENDOR_BADGE_LABELS[vendor.badge]} Badge`
                    : "Badge inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Information */}

          <div className="grid gap-6 md:grid-cols-2">
            <Info label="Email" value={vendor.email} />
            <Info label="Phone" value={vendor.phone} />
            <Info label="Category" value={vendor.category} />
            <Info label="City" value={vendor.city} />
            <Info label="GST Number" value={vendor.gstNumber} />
            <Info label="Experience" value={vendor.experience} />
            <Info
              label="Monthly Booking Limit"
              value={monthlyBookingLimitLabel}
            />
            <Info
              label="Badge Purchased At"
              value={
                vendor.badgePurchasedAt
                  ? new Date(
                      vendor.badgePurchasedAt
                    ).toLocaleDateString()
                  : "-"
              }
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-gray-700">
              Vendor Badge
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {isApproved
                ? "Badge decides how many bookings this vendor can receive per month."
                : "Approve this vendor before assigning an active badge."}
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {(
                [
                  "bronze",
                  "silver",
                  "gold",
                ] as VendorBadge[]
              ).map((badge) => {
                const active =
                  vendor.badge === badge;

                return (
                  <button
                    key={badge}
                    type="button"
                    disabled={!isApproved || !canManage}
                    onClick={() => {
                      if (!isApproved || !canManage) {
                        return;
                      }

                      onBadgeChange(
                        vendor.id,
                        badge
                      );
                    }}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      !isApproved || !canManage
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-70"
                        : active
                        ? "border-rose-500 bg-white shadow-sm"
                        : "border-slate-200 bg-white hover:border-rose-300"
                    }`}
                  >
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${VENDOR_BADGE_COLORS[badge]}`}
                    >
                      {VENDOR_BADGE_LABELS[badge]}
                    </span>

                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      {
                        VENDOR_BADGE_LIMITS[
                          badge
                        ]
                      }{" "}
                      bookings/month
                    </p>

                    {!isApproved &&
                      active && (
                        <p className="mt-2 text-xs font-medium text-slate-500">
                          Not active yet
                        </p>
                      )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}

          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Description
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              {vendor.description || "-"}
            </p>
          </div>

          {/* Social */}

          <div className="grid gap-6 md:grid-cols-2">
            <Info label="Website" value={vendor.website} />
            <Info label="Instagram" value={vendor.instagram} />
            <Info label="Facebook" value={vendor.facebook} />
            <Info label="LinkedIn" value={vendor.linkedin} />
          </div>

          {/* Actions */}

          <div className="flex justify-end gap-4">
            {canManage && vendor.approvalStatus !== "approved" && (
              <button
                onClick={() => onApprove(vendor.id)}
                className="rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Approve Vendor
              </button>
            )}

            {canManage && vendor.approvalStatus !== "rejected" && (
              <button
                onClick={() => onReject(vendor.id)}
                className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                Reject Vendor
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-base font-medium text-gray-600">
        {value || "-"}
      </p>
    </div>
  );
}
