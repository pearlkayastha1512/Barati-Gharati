"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import CustomerHero from "@/components/admin/customers/CustomerHero";
import CustomerStats from "@/components/admin/customers/CustomerStats";
import CustomerFilters from "@/components/admin/customers/CustomerFilters";
import CustomerTable from "@/components/admin/customers/CustomerTable";
import CustomerDetailsModal from "@/components/admin/customers/CustomerDetailsModal";

import { User } from "@/types/auth";
import { getAllUsersApi } from "@/services/api/admin.api";

type AdminUserResponse = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  role?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  membership?: "FREE" | "PREMIUM";
  adminVerificationStatus?: "PENDING" | "APPROVED" | "REJECTED";
  adminVerifiedAt?: string | null;
  adminRejectionReason?: string | null;
};

type ApiUsersResponse = {
  data?: AdminUserResponse[];
};

function mapAdminUser(
  user: AdminUserResponse
): User {
  const role =
    user.role?.toLowerCase() === "admin"
      ? "admin"
      : user.role?.toLowerCase() === "vendor"
      ? "vendor"
      : "customer";

  return {
    _id: user._id ?? user.id ?? "",
    name: user.name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    avatar: "",
    role,
    isVerified: user.isVerified ?? false,
    createdAt:
      user.createdAt ??
      new Date().toISOString(),
    updatedAt:
      user.updatedAt ??
      user.createdAt ??
      new Date().toISOString(),
    membership: user.membership ?? "FREE",
    adminVerificationStatus: user.adminVerificationStatus?.toLowerCase() as User["adminVerificationStatus"] ?? "pending",
    adminVerifiedAt: user.adminVerifiedAt,
    adminRejectionReason: user.adminRejectionReason,
  };
}

export default function CustomerManagementPage() {
  const [customers, setCustomers] =
    useState<User[]>([]);

  useEffect(() => {
    async function loadCustomers() {
      const result = await getAllUsersApi();

      if (!result.ok) {
        setCustomers([]);
        return;
      }

      const users =
        (result.data as ApiUsersResponse)
          ?.data ?? [];

      setCustomers(
        users
          .map(mapAdminUser)
          .filter(
            (user) =>
              user.role === "customer"
          )
      );
    }

    void loadCustomers();
  }, []);

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

      <CustomerStats customers={customers} />

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
        onVerificationChange={(status) => {
          setCustomers((current) => current.map((customer) => customer._id === selectedCustomer?._id ? { ...customer, adminVerificationStatus: status } : customer));
          setSelectedCustomer((customer) => customer ? { ...customer, adminVerificationStatus: status } : customer);
        }}
      />
    </div>
  );
}
