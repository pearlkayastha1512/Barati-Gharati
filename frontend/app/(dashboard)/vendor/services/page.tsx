"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ServiceHero from "@/components/vendor/services/ServiceHero";
import ServiceStats from "@/components/vendor/services/ServiceStats";
import ServiceFilters from "@/components/vendor/services/ServiceFilters";
import ServiceGrid from "@/components/vendor/services/ServiceGrid";
import AddServiceCard from "@/components/vendor/services/AddServiceCard";
import AddServiceModal from "@/components/vendor/services/AddServiceModal";

import { useAuthStore } from "@/store/authStore";
import { useServiceStore } from "@/store/serviceStore";
import { VENDOR_CATEGORIES } from "@/constants/categories";

export default function VendorServicesPage() {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const { user } = useAuthStore();

  const {
    services,
    loadMyServices,
  } = useServiceStore();

  useEffect(() => {
    async function loadVendor() {
      if (!user) return;

      await loadMyServices();
    }

    loadVendor();
  }, [user, loadMyServices]);


//   useEffect(() => {
//   async function loadServices() {
//     if (!user) return;

//     await loadVendorServices(0);
//   }

//   loadServices();
// }, [user, loadVendorServices]);
  const categories = useMemo(
    () => [
      ...new Set(
        [
          ...VENDOR_CATEGORIES,
          ...services.map(
            (service) => service.category
          ),
        ]
      ),
    ],
    [services]
  );

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        service.category === category;

      const matchesStatus =
        status === "All" ||
        service.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    services,
    search,
    category,
    status,
  ]);

  return (
    <div className="space-y-8">
      <ServiceHero
        onAddService={() => setOpen(true)}
      />

      <ServiceStats />

      <ServiceFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        categories={categories}
      />

      <ServiceGrid
        services={filteredServices}
        onEdit={() => setOpen(true)}
      />

      <AddServiceCard
        onCreate={() => setOpen(true)}
      />

      <AddServiceModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
