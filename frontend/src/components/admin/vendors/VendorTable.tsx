"use client";

import Image from "next/image";
import { Eye } from "lucide-react";

import { StoredVendor } from "@/services/vendor.service";
import {
  VENDOR_BADGE_COLORS,
  VENDOR_BADGE_LABELS,
} from "@/constants/vendor-badges";

interface Props {
  vendors: StoredVendor[];

  onView: (vendor: StoredVendor) => void;
}

export default function VendorTable({
  vendors,
  onView,
}: Props) {
  if (vendors.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-20 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-700">
          No Vendors Found
        </h2>

        <p className="mt-3 text-slate-500">
          Try changing the filters.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="px-6 py-4 font-semibold text-slate-700">
                Vendor
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Category
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                City
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Approval
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Badge
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Monthly Usage
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Business
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Status
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="text-slate-600">
            {vendors.map((vendor) => (
              <tr
                key={vendor.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-slate-100">
                      {vendor.profileImage ? (
                        <Image
                          src={vendor.profileImage}
                          alt={vendor.businessName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xl font-bold text-slate-400">
                          {vendor.businessName.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {vendor.businessName}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {vendor.ownerName}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  {vendor.category}
                </td>

                <td className="px-6 py-5">
                  {vendor.city}
                </td>

                {/* Approval Status */}
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
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
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${VENDOR_BADGE_COLORS[vendor.badge]}`}
                  >
                    {VENDOR_BADGE_LABELS[vendor.badge]}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span className="font-semibold text-slate-800">
                    {vendor.currentMonthBookings}
                  </span>
                  <span className="text-slate-500">
                    /{vendor.monthlyBookingLimit}
                  </span>
                </td>

                {/* Business Verification */}
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      vendor.businessVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {vendor.businessVerified
                      ? "Verified"
                      : "Unverified"}
                  </span>
                </td>

                {/* Vendor Active Status */}
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      vendor.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {vendor.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(vendor)}
                      className="rounded-xl bg-slate-100 p-2 transition hover:bg-slate-200"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
