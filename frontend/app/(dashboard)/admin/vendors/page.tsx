"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import VendorHero from "@/components/admin/vendors/VendorHero";
import VendorStats from "@/components/admin/vendors/VendorStats";
import VendorFilters from "@/components/admin/vendors/VendorFilters";
import VendorTable from "@/components/admin/vendors/VendorTable";
import VendorDetailsModal from "@/components/admin/vendors/VendorDetailsModal";

import { useAdminStore } from "@/store/adminStore";
import { StoredVendor } from "@/services/vendor.service";
import {
  approveVendorApi,
  rejectVendorApi,
} from "@/services/api/admin.api";

export default function VendorManagementPage() {
  const {
    vendors,
    loadVendors,
    loadDashboard,
  } = useAdminStore();

  useEffect(() => {
    loadVendors();
    loadDashboard();
  }, [loadVendors, loadDashboard]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [category, setCategory] = useState("");

  const [selectedVendor, setSelectedVendor] =
    useState<StoredVendor | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const handleViewVendor = (
  vendor: StoredVendor
) => {
  setSelectedVendor(
    vendor
  );

  setIsModalOpen(true);
};

  const handleApproveVendor = async (
    vendorId: number
  ) => {
    const result =
      await approveVendorApi(
        String(vendorId)
      );

    if (!result.ok) {
      toast.error("Unable to approve vendor.");
      return;
    }

    loadVendors();
    loadDashboard();

    setIsModalOpen(false);
    setSelectedVendor(null);

    toast.success(
      "Vendor approved successfully."
    );
  };

  const handleRejectVendor = async (
    vendorId: number
  ) => {
    const result =
      await rejectVendorApi(
        String(vendorId)
      );

    if (!result.ok) {
      toast.error("Unable to reject vendor.");
      return;
    }

    loadVendors();
    loadDashboard();

    setIsModalOpen(false);
    setSelectedVendor(null);

    toast.success(
      "Vendor rejected successfully."
    );
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesSearch =
        vendor.businessName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        vendor.ownerName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        vendor.city
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "" ||
        vendor.category
          .toLowerCase()
          .includes(category.toLowerCase());

      let matchesStatus = true;

      switch (status) {
        case "approved":
          matchesStatus =
            vendor.approvalStatus ===
            "approved";
          break;

        case "pending":
          matchesStatus =
            vendor.approvalStatus ===
            "pending";
          break;

        case "rejected":
          matchesStatus =
            vendor.approvalStatus ===
            "rejected";
          break;

        default:
          matchesStatus = true;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    vendors,
    search,
    status,
    category,
  ]);

  return (
    <div className="space-y-8">
      <VendorHero />

      <VendorStats vendors={vendors} />

      <VendorFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        category={category}
        setCategory={setCategory}
      />

      <VendorTable
        vendors={filteredVendors}
        onView={handleViewVendor}
      />

      <VendorDetailsModal
        vendor={selectedVendor}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVendor(null);
        }}
        onApprove={handleApproveVendor}
        onReject={handleRejectVendor}
      />
    </div>
  );
}
