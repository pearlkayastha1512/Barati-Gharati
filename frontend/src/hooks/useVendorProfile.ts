"use client";

import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/authStore";
import {
  getVendorByUserId,
  StoredVendor,
} from "@/services/vendor.service";

export function useVendorProfile() {
  const { user } = useAuthStore();

  const [vendor, setVendor] = useState<StoredVendor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadVendor() {
      if (!user) {
        if (active) {
          setVendor(null);
          setIsLoading(false);
          setError(null);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await getVendorByUserId();

        if (!active) {
          return;
        }

        setVendor(data ?? null);
        setError(
          data
            ? null
            : "Vendor profile could not be loaded."
        );
      } catch {
        if (!active) {
          return;
        }

        setVendor(null);
        setError(
          "Vendor profile could not be loaded."
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadVendor();

    const reloadVendor = () => {
      void loadVendor();
    };

    window.addEventListener(
      "vendor-profile-updated",
      reloadVendor
    );

    return () => {
      active = false;
      window.removeEventListener(
        "vendor-profile-updated",
        reloadVendor
      );
    };
  }, [user]);

  return {
    vendor,
    setVendor,
    isLoading,
    error,
  };
}
