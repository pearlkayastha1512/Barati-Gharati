// import { create } from "zustand";
// import { VendorAccountInfo, VendorBusinessInfo, VendorGalleryInfo } from "../types/vendor";

// // TODO: import API function once backend is connected
// // import { registerVendor } from "../api/vendor.api";

// interface VendorRegistrationState {
//   step: number; // 1: Account, 2: Business, 3: Gallery, 4: Review, 5: Success
//   account: VendorAccountInfo;
//   business: VendorBusinessInfo;
//   gallery: VendorGalleryInfo;
//   setAccount: (data: VendorAccountInfo) => void;
//   setBusiness: (data: VendorBusinessInfo) => void;
//   setGallery: (data: VendorGalleryInfo) => void;
//   goToStep: (step: number) => void;
//   nextStep: () => void;
//   prevStep: () => void;
//   reset: () => void;
// }

// const initialAccount: VendorAccountInfo = {
//   ownerName: "",
//   businessEmail: "",
//   phone: "",
//   password: "",
//   confirmPassword: "",
// };

// const initialBusiness: VendorBusinessInfo = {
//   businessName: "",
//   category: "",
//   city: "",
//   address: "",
//   description: "",
// };

// const initialGallery: VendorGalleryInfo = {
//   profileImageUri: null,
//   coverImageUri: null,
// };

// export const useVendorRegistrationStore = create<VendorRegistrationState>((set) => ({
//   step: 1,
//   account: initialAccount,
//   business: initialBusiness,
//   gallery: initialGallery,

//   setAccount: (data) => set({ account: data }),
//   setBusiness: (data) => set({ business: data }),
//   setGallery: (data) => set({ gallery: data }),

//   goToStep: (step) => set({ step }),
//   nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 5) })),
//   prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

//   reset: () =>
//     set({
//       step: 1,
//       account: initialAccount,
//       business: initialBusiness,
//       gallery: initialGallery,
//     }),
// }));

// import { create } from "zustand";

// import {
//   VendorAccountInfo,
//   VendorBusinessInfo,
//   VendorGalleryInfo,
// } from "../types/vendor";

// import {
//   registerVendor,
//   RegisterVendorRequest,
// } from "../api/vendor.api";

// interface VendorRegistrationState {
//   step: number;

//   account: VendorAccountInfo;
//   business: VendorBusinessInfo;
//   gallery: VendorGalleryInfo;

//   setAccount: (
//     data: VendorAccountInfo
//   ) => void;

//   setBusiness: (
//     data: VendorBusinessInfo
//   ) => void;

//   setGallery: (
//     data: VendorGalleryInfo
//   ) => void;

//   goToStep: (
//     step: number
//   ) => void;

//   nextStep: () => void;

//   prevStep: () => void;

//   submitRegistration: () => Promise<void>;

//   reset: () => void;
// }

// const initialAccount: VendorAccountInfo = {
//   ownerName: "",
//   businessEmail: "",
//   phone: "",
//   password: "",
//   confirmPassword: "",
// };

// const initialBusiness: VendorBusinessInfo = {
//   businessName: "",
//   category: "",
//   city: "",
//   address: "",
//   description: "",
// };

// const initialGallery: VendorGalleryInfo = {
//   profileImageUri: null,
//   coverImageUri: null,
// };

// export const useVendorRegistrationStore =
//   create<VendorRegistrationState>(
//     (set, get) => ({
//       step: 1,

//       account: initialAccount,

//       business: initialBusiness,

//       gallery: initialGallery,

//       setAccount: (data) =>
//         set({
//           account: data,
//         }),

//       setBusiness: (data) =>
//         set({
//           business: data,
//         }),

//       setGallery: (data) =>
//         set({
//           gallery: data,
//         }),

//       goToStep: (step) =>
//         set({
//           step,
//         }),

//       nextStep: () =>
//         set((state) => ({
//           step: Math.min(
//             state.step + 1,
//             5
//           ),
//         })),

//       prevStep: () =>
//         set((state) => ({
//           step: Math.max(
//             state.step - 1,
//             1
//           ),
//         })),

//       submitRegistration: async () => {
//         const {
//           account,
//           business,
//         } = get();

//         const payload: RegisterVendorRequest =
//           {
//             ownerName:
//               account.ownerName,

//             email:
//               account.businessEmail,

//             phone:
//               account.phone,

//             password:
//               account.password,

//             businessName:
//               business.businessName,

//             category:
//               business.category,

//             city: business.city,

//             address:
//               business.address,

//             description:
//               business.description,
//           };

//         await registerVendor(
//           payload
//         );

//         set({
//           step: 5,
//         });
//       },

//       reset: () =>
//         set({
//           step: 1,

//           account:
//             initialAccount,

//           business:
//             initialBusiness,

//           gallery:
//             initialGallery,
//         }),
//     })
//   );





























import { create } from "zustand";

import {
  VendorAccountInfo,
  VendorBusinessInfo,
  VendorGalleryInfo,
} from "../types/vendor";

import {
  registerVendor,
  RegisterVendorRequest,
  uploadVendorRegistrationImage,
} from "../api/vendor.api";
import { RazorpaySuccess } from "../types/payment";

export type RegistrationBadge = "bronze" | "silver" | "gold";
export type RegistrationBadgeBillingCycle = "monthly" | "yearly";

interface VendorRegistrationState {
  step: number;

  account: VendorAccountInfo;
  business: VendorBusinessInfo;
  gallery: VendorGalleryInfo;
  selectedBadge: RegistrationBadge;
  badgeBillingCycle: RegistrationBadgeBillingCycle;
  registrationVerificationId: string | null;

  setAccount: (
    data: VendorAccountInfo
  ) => void;

  setBusiness: (
    data: VendorBusinessInfo
  ) => void;

  setGallery: (
    data: VendorGalleryInfo
  ) => void;

  setSelectedBadge: (badge: RegistrationBadge) => void;
  setBadgeBillingCycle: (cycle: RegistrationBadgeBillingCycle) => void;
  setRegistrationVerificationId: (id: string | null) => void;

  goToStep: (
    step: number
  ) => void;

  nextStep: () => void;

  prevStep: () => void;

  submitRegistration: (payment?: RazorpaySuccess) => Promise<any>;

  reset: () => void;
}

const initialAccount: VendorAccountInfo = {
  ownerName: "",
  businessEmail: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const initialBusiness: VendorBusinessInfo = {
  businessName: "",
  category: "",
  city: "",
  address: "",
  description: "",
};

const initialGallery: VendorGalleryInfo = {
  profileImageUri: null,
  coverImageUri: null,
};

export const useVendorRegistrationStore =
  create<VendorRegistrationState>(
    (set, get) => ({
      step: 1,

      account: initialAccount,

      business: initialBusiness,

      gallery: initialGallery,
      selectedBadge: "bronze",
      badgeBillingCycle: "monthly",
      registrationVerificationId: null,

      setAccount: (data) =>
        set({
          account: data,
        }),

      setBusiness: (data) =>
        set({
          business: data,
        }),

      setGallery: (data) =>
        set({
          gallery: data,
        }),

      setSelectedBadge: (selectedBadge) => set({ selectedBadge }),
      setBadgeBillingCycle: (badgeBillingCycle) => set({ badgeBillingCycle }),
      setRegistrationVerificationId: (registrationVerificationId) => set({ registrationVerificationId }),

      goToStep: (step) =>
        set({
          step,
        }),

      nextStep: () =>
        set((state) => ({
          step: Math.min(
            state.step + 1,
            5
          ),
        })),

      prevStep: () =>
        set((state) => ({
          step: Math.max(
            state.step - 1,
            1
          ),
        })),

      submitRegistration: async (payment) => {
        const {
          account,
          business,
          gallery,
          selectedBadge,
          badgeBillingCycle,
          registrationVerificationId,
        } = get();

        if (!registrationVerificationId) {
          throw new Error("Please verify your business email before registration.");
        }

        const [profileImage, coverImage] = await Promise.all([
          gallery.profileImageUri
            ? uploadVendorRegistrationImage(gallery.profileImageUri)
            : Promise.resolve(undefined),
          gallery.coverImageUri
            ? uploadVendorRegistrationImage(gallery.coverImageUri)
            : Promise.resolve(undefined),
        ]);

        set({
          gallery: {
            profileImageUri: profileImage ?? null,
            coverImageUri: coverImage ?? null,
          },
        });

        const payload: RegisterVendorRequest =
          {
            registrationVerificationId,
            ownerName:
              account.ownerName,

            email:
              account.businessEmail,

            phone:
              account.phone,

            password:
              account.password,

            businessName:
              business.businessName,

            category:
              business.category,

            city: business.city,

            address:
              business.address,

            description:
              business.description,

            profileImage,
            coverImage,
            selectedBadge: selectedBadge.toUpperCase() as "BRONZE" | "SILVER" | "GOLD",
            badgeBillingCycle: badgeBillingCycle.toUpperCase() as "MONTHLY" | "YEARLY",
            badgePaymentOrderId: payment?.razorpay_order_id,
            badgePaymentId: payment?.razorpay_payment_id,
            badgePaymentSignature: payment?.razorpay_signature,
          };

        const response =
          await registerVendor(
            payload
          );

        set({
          step: 5,
        });

        return response;
      },

      reset: () =>
        set({
          step: 1,

          account:
            initialAccount,

          business:
            initialBusiness,

          gallery:
            initialGallery,
          selectedBadge: "bronze",
          badgeBillingCycle: "monthly",
          registrationVerificationId: null,
        }),
    })
  );
