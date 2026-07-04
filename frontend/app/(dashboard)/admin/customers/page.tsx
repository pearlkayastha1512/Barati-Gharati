"use client";

import { useMemo, useState } from "react";

import CustomerHero from "@/components/admin/customers/CustomerHero";
import CustomerStats from "@/components/admin/customers/CustomerStats";
import CustomerFilters from "@/components/admin/customers/CustomerFilters";
import CustomerTable from "@/components/admin/customers/CustomerTable";
import CustomerDetailsModal from "@/components/admin/customers/CustomerDetailsModal";

import { getUsers } from "@/services/auth.service";
import { User } from "@/types/auth";

export default function CustomerManagementPage() {
  const customers = useMemo(
    () =>
      getUsers().filter(
        (user) => user.role === "customer"
      ),
    []
  );

  const [search, setSearch] = useState("");

  const [verification, setVerification] =
    useState("all");

  const [selectedCustomer, setSelectedCustomer] =
    useState<User | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        customer.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        customer.phone.includes(search);

      let matchesVerification = true;

      if (verification === "verified") {
        matchesVerification =
          customer.isVerified;
      }

      if (verification === "unverified") {
        matchesVerification =
          !customer.isVerified;
      }

      return (
        matchesSearch &&
        matchesVerification
      );
    });
  }, [
    customers,
    search,
    verification,
  ]);

  const handleViewCustomer = (
    customer: User
  ) => {
    setSelectedCustomer(customer);

    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <CustomerHero />

      <CustomerStats />

      <CustomerFilters
        search={search}
        setSearch={setSearch}
        verification={verification}
        setVerification={setVerification}
      />

      <CustomerTable
        customers={filteredCustomers}
        onView={handleViewCustomer}
      />

      <CustomerDetailsModal
        customer={selectedCustomer}
        open={isModalOpen}
        onClose={() => {
          setSelectedCustomer(null);

          setIsModalOpen(false);
        }}
      />
    </div>
  );
}