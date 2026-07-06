// import { create } from "zustand";

// import { WishlistItem } from "@/types/wishlist";

// import {
//   getWishlist,
//   addToWishlist,
//   removeFromWishlist,
//   isWishlisted,
//   clearWishlist,
// } from "@/services/wishlist.service";

// interface WishlistStore {
//   wishlist: WishlistItem[];

//   // Sorting
//   sortBy: string;

//   setSortBy: (
//     value: string
//   ) => void;

//   loadWishlist: (
//     customerId: string
//   ) => void;

//   addVendor: (
//     item: WishlistItem
//   ) => void;

//   removeVendor: (
//     customerId: string,
//     vendorId: number
//   ) => void;

//   toggleWishlist: (
//     item: WishlistItem
//   ) => void;

//   isVendorWishlisted: (
//     customerId: string,
//     vendorId: number
//   ) => boolean;

//   clearCustomerWishlist: (
//     customerId: string
//   ) => void;
// }

// export const useWishlistStore =
//   create<WishlistStore>((set) => ({
//     wishlist: [],

//     // Default sorting
//     sortBy: "Latest Saved",

//     setSortBy: (sortBy) =>
//       set({
//         sortBy,
//       }),

//     loadWishlist: (customerId) => {
//       set({
//         wishlist: getWishlist(customerId),
//       });
//     },

//     addVendor: (item) => {
//       addToWishlist(item);

//       set({
//         wishlist: getWishlist(
//           item.customerId
//         ),
//       });
//     },

//     removeVendor: (
//       customerId,
//       vendorId
//     ) => {
//       removeFromWishlist(
//         customerId,
//         vendorId
//       );

//       set({
//         wishlist:
//           getWishlist(customerId),
//       });
//     },

//     toggleWishlist: (item) => {
//       if (
//         isWishlisted(
//           item.customerId,
//           item.vendorId
//         )
//       ) {
//         removeFromWishlist(
//           item.customerId,
//           item.vendorId
//         );
//       } else {
//         addToWishlist(item);
//       }

//       set({
//         wishlist: getWishlist(
//           item.customerId
//         ),
//       });
//     },

//     isVendorWishlisted: (
//       customerId,
//       vendorId
//     ) => {
//       return isWishlisted(
//         customerId,
//         vendorId
//       );
//     },

//     clearCustomerWishlist: (
//       customerId
//     ) => {
//       clearWishlist(customerId);

//       set({
//         wishlist: [],
//       });
//     },
//   }));





import { create } from "zustand";

import { WishlistItem } from "@/types/wishlist";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isWishlisted,
} from "@/services/wishlist.service";

interface WishlistStore {
  wishlist: WishlistItem[];

  sortBy: string;

  hasLoaded: boolean;

  isLoading: boolean;

  setSortBy: (
    value: string
  ) => void;

  loadWishlist: () => Promise<void>;

  addVendor: (
    vendorId: number
  ) => Promise<boolean>;

  removeVendor: (
    vendorId: number
  ) => Promise<boolean>;

  toggleWishlist: (
    vendorId: number
  ) => Promise<boolean>;

  clearCustomerWishlist: () => void;

  isVendorWishlisted: (
    vendorId: number
  ) => boolean;
}

export const useWishlistStore =
  create<WishlistStore>((set,get) => ({
    wishlist: [],

    sortBy: "Latest Saved",

    hasLoaded: false,

    isLoading: false,

    setSortBy: (sortBy) =>
      set({
        sortBy,
      }),

    loadWishlist: async () => {
      const state = get();

      if (state.isLoading || state.hasLoaded) {
        return;
      }

      set({ isLoading: true });

      try {
        const wishlist = await getWishlist();

        set({
          wishlist,
          hasLoaded: true,
        });
      } finally {
        set({ isLoading: false });
      }
    },

    addVendor: async (
      vendorId
    ) => {
      const success =
        await addToWishlist(
          vendorId
        );

      if (!success) {
        return false;
      }

      const wishlist =
        await getWishlist();

      set({
        wishlist,
        hasLoaded: true,
      });

      return true;
    },

    removeVendor: async (
      vendorId
    ) => {
      const success =
        await removeFromWishlist(
          vendorId
        );

      if (!success) {
        return false;
      }

      const wishlist =
        await getWishlist();

      set({
        wishlist,
        hasLoaded: true,
      });

      return true;
    },

    toggleWishlist:
      async (vendorId) => {
        const exists =
          await isWishlisted(
            vendorId
          );

        let success = false;

        if (exists) {
          success = await removeFromWishlist(
            vendorId
          );
        } else {
          success = await addToWishlist(
            vendorId
          );
        }

        if (!success) {
          return false;
        }

        const wishlist =
          await getWishlist();

        set({
          wishlist,
          hasLoaded: true,
        });

        return true;
      },

    // isVendorWishlisted:
    //   async (vendorId) => {
    //     return await isWishlisted(
    //       vendorId
    //     );
    //   },

    clearCustomerWishlist: () => {
      set({
        wishlist: [],
        hasLoaded: false,
      });
    },

    isVendorWishlisted: (vendorId) => {
      return get().wishlist.some(
        (item) => item.vendorId === vendorId
      );
},
  }));