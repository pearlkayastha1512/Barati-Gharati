import { CustomerProfile } from "@/types/customerProfile";

const STORAGE_KEY = "customer_profile";

class CustomerProfileService {
  getProfile(
    customerId: string
  ): CustomerProfile {
    if (typeof window === "undefined") {
      return this.getDefaultProfile(customerId);
    }

    const data = localStorage.getItem(
      STORAGE_KEY
    );

    if (!data) {
      const profile =
        this.getDefaultProfile(customerId);

      this.saveProfile(profile);

      return profile;
    }

    const profile: CustomerProfile =
      JSON.parse(data);

    if (
      profile.customerId !== customerId
    ) {
      const newProfile =
        this.getDefaultProfile(customerId);

      this.saveProfile(newProfile);

      return newProfile;
    }

    return profile;
  }

  saveProfile(
    profile: CustomerProfile
  ) {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(profile)
    );
  }

  updateProfile(
    profile: CustomerProfile
  ) {
    this.saveProfile(profile);
  }

  private getDefaultProfile(
    customerId: string
  ): CustomerProfile {
    return {
      customerId,

      gender: "",

      address: "",

      city: "",

      state: "",

      country: "",

      partnerName: "",

      partnerEmail: "",

      partnerPhone: "",

      partnerOccupation: "",

      weddingDate: "",

      weddingVenue: "",

      guestCount: 0,

      weddingTheme: "",
    };
  }
}

export const customerProfileService =
  new CustomerProfileService();