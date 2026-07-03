"use client";

import { useRouter } from "next/navigation";

import {
  LogOut,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { usePlannerStore } from "@/store/plannerStore";
import { useExpenseStore } from "@/store/expenseStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCustomerProfileStore } from "@/store/customerProfileStore";
import { useCustomerStore } from "@/store";

export default function DangerZone() {
  const router = useRouter();

  const logout = useAuthStore(
    (state) => state.logout
  );
  const resetCustomer =
  useCustomerStore(
    (state) => state.reset
  );
  const clearPlanner =
    usePlannerStore(
      (state) => state.clearTasks
    );

  const clearCustomerWishlist =
  useWishlistStore(
    (state) => state.clearCustomerWishlist
  );

  const bookings =
    useBookingStore(
      (state) => state.bookings
    );

  const deleteBooking =
    useBookingStore(
      (state) => state.deleteBooking
    );

  const expenses =
    useExpenseStore(
      (state) => state.expenses
    );

  const deleteExpense =
    useExpenseStore(
      (state) => state.deleteExpense
    );

  const resetProfile =
    useCustomerProfileStore(
      (state) => state.resetProfile
    );
         
  const handleLogout = () => {
    logout();

    toast.success(
      "Logged out successfully."
    );

    router.push("/");
  };

  const handleDeleteAccount = () => {
  const confirmed = window.confirm(
    "Delete your account? This cannot be undone."
  );

  if (!confirmed) {
    return;
  }

  bookings.forEach((booking) =>
    deleteBooking(booking.id)
  );

  expenses.forEach((expense) =>
    deleteExpense(expense.id)
  );

  clearPlanner();
  if (useAuthStore.getState().user) {
  clearCustomerWishlist(
    useAuthStore.getState().user!._id
  );
}
  resetProfile();

  localStorage.removeItem(
    "customer_profile"
  );

  localStorage.removeItem(
    "customer_settings"
  );

  localStorage.removeItem(
    "customer_budget"
  );

  // Reset customer store
  resetCustomer();

  // Logout
  logout();

  toast.success(
    "Account deleted successfully."
  );

  router.push("/");
};

  return (
    <section className="rounded-3xl border border-red-200 bg-red-50 p-7">

      <h2 className="text-2xl font-bold text-red-600">
        Danger Zone
      </h2>

      <p className="mt-2 text-red-500">
        These actions are irreversible.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-2xl border border-gray-300 bg-white px-6 py-4 text-green-600 transition hover:bg-gray-100"
        >
          <LogOut size={18} />

          Logout

        </button>

        <button
          onClick={
            handleDeleteAccount
          }
          className="flex items-center gap-3 rounded-2xl bg-red-600 px-6 py-4 text-white transition hover:bg-red-700"
        >
          <Trash2 size={18} />

          Delete Account

        </button>

      </div>

    </section>
  );
}