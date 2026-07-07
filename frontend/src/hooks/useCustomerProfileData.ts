"use client";

import { useEffect, useMemo } from "react";

import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { useCustomerProfileStore } from "@/store/customerProfileStore";

const formatDate = (date?: string) => {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};

export function useCustomerProfileData() {
  const user = useAuthStore(
    (state) => state.user
  );
  const bookings = useBookingStore(
    (state) => state.bookings
  );
  const loadCustomerBookings =
    useBookingStore(
      (state) => state.loadCustomerBookings
    );
  const profile =
    useCustomerProfileStore(
      (state) => state.profile
    );
  const loadProfile =
    useCustomerProfileStore(
      (state) => state.loadProfile
    );

  useEffect(() => {
    if (!user) {
      return;
    }

    loadProfile(user._id);
    void loadCustomerBookings(user._id);
  }, [loadCustomerBookings, loadProfile, user]);

  const latestBooking = useMemo(() => {
    return [...bookings].sort(
      (first, second) =>
        new Date(
          second.createdAt || second.eventDate
        ).getTime() -
        new Date(
          first.createdAt || first.eventDate
        ).getTime()
    )[0];
  }, [bookings]);

  return useMemo(() => {
    const partnerName =
      latestBooking?.partnerName ||
      derivePartnerName(
        user?.name,
        latestBooking?.brideName,
        latestBooking?.groomName
      ) ||
      profile?.partnerName ||
      "";

    return {
      user,
      profile,
      latestBooking,
      personal: {
        fullName:
          latestBooking?.customerName ||
          user?.name ||
          "",
        email:
          latestBooking?.customerEmail ||
          user?.email ||
          "",
        phone:
          latestBooking?.customerPhone ||
          user?.phone ||
          "",
        gender: profile?.gender || "",
      },
      partner: {
        name: partnerName,
        email:
          latestBooking?.partnerEmail ||
          profile?.partnerEmail ||
          "",
        phone:
          latestBooking?.partnerPhone ||
          profile?.partnerPhone ||
          "",
        occupation:
          latestBooking?.partnerOccupation ||
          profile?.partnerOccupation ||
          "",
      },
      wedding: {
        date:
          latestBooking?.eventDate ||
          profile?.weddingDate ||
          "",
        formattedDate: formatDate(
          latestBooking?.eventDate ||
            profile?.weddingDate
        ),
        venue:
          latestBooking?.venue ||
          profile?.weddingVenue ||
          "",
        guests:
          latestBooking?.guests ||
          profile?.guestCount ||
          0,
        theme:
          latestBooking?.weddingTheme ||
          profile?.weddingTheme ||
          "",
        eventType:
          latestBooking?.eventType || "",
        packageName:
          latestBooking?.packageName || "",
      },
      contact: {
        address:
          latestBooking?.contactAddress ||
          profile?.address ||
          "",
        city:
          latestBooking?.city ||
          profile?.city ||
          "",
        state:
          latestBooking?.contactState ||
          profile?.state ||
          "",
        country:
          latestBooking?.contactCountry ||
          profile?.country ||
          "",
      },
    };
  }, [latestBooking, profile, user]);
}

function derivePartnerName(
  userName?: string,
  brideName?: string,
  groomName?: string
) {
  const normalizedUser =
    userName?.trim().toLowerCase();

  if (!normalizedUser) {
    return groomName || brideName || "";
  }

  if (
    brideName?.trim().toLowerCase() ===
    normalizedUser
  ) {
    return groomName || "";
  }

  if (
    groomName?.trim().toLowerCase() ===
    normalizedUser
  ) {
    return brideName || "";
  }

  return groomName || brideName || "";
}
