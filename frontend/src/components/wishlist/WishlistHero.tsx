// "use client";

// import { motion } from "framer-motion";
// import Link from "next/link";
// import {
//   Heart,
//   ArrowRight,
//   Sparkles,
//   Bookmark,
// } from "lucide-react";

// export default function WishlistHero() {
//   return (
//     <motion.section
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.45 }}
//       className="
//         relative
//         overflow-hidden
//         rounded-[32px]
//         bg-gradient-to-br
//         from-rose-500
//         via-pink-500
//         to-red-500
//         p-8
//         text-white
//         shadow-xl
//       "
//     >
//       <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

//       <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

//       <div className="relative z-10 grid gap-8 lg:grid-cols-2">

//         <div>

//           <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">

//             <Sparkles size={16} />

//             <span className="text-sm font-medium">
//               Your Wishlist
//             </span>

//           </div>

//           <h1 className="mt-6 text-5xl font-bold leading-tight">
//             Vendors you've
//             <br />
//             fallen in love with.
//           </h1>

//           <p className="mt-6 max-w-xl text-lg text-rose-100">
//             Save your favorite vendors, compare them,
//             and book when you're ready.
//           </p>

//           <Link
//             href="/vendors"
//             className="
//               mt-8
//               inline-flex
//               items-center
//               gap-2
//               rounded-2xl
//               bg-white
//               px-6
//               py-4
//               font-semibold
//               text-rose-600
//               transition
//               hover:-translate-y-1
//             "
//           >
//             Explore More Vendors

//             <ArrowRight size={18} />

//           </Link>

//         </div>

//         <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">

//           <div className="flex items-center gap-3">

//             <Bookmark size={22} />

//             <h3 className="text-xl font-semibold">
//               Wishlist Summary
//             </h3>

//           </div>

//           <div className="mt-8 space-y-5">

//             <div className="flex items-center justify-between">

//               <span className="flex items-center gap-2">

//                 <Heart size={18} />

//                 Saved Vendors

//               </span>

//               <span className="font-semibold">
//                 15
//               </span>

//             </div>

//             <div className="flex items-center justify-between">

//               <span>
//                 Recently Added
//               </span>

//               <span className="font-semibold">
//                 3
//               </span>

//             </div>

//             <div className="flex items-center justify-between">

//               <span>
//                 Ready to Book
//               </span>

//               <span className="font-semibold">
//                 6
//               </span>

//             </div>

//           </div>

//         </div>

//       </div>

//     </motion.section>
//   );
// }



"use client";

import { useMemo } from "react";

import { motion } from "framer-motion";
import Link from "next/link";

import {
  Heart,
  ArrowRight,
  Sparkles,
  Bookmark,
} from "lucide-react";

import { useWishlistStore } from "@/store/wishlistStore";
import { useBookingStore } from "@/store/bookingStore";

export default function WishlistHero() {
  const wishlist = useWishlistStore(
    (state) => state.wishlist
  );

  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const {
    totalSaved,
    recentlyAdded,
    readyToBook,
  } = useMemo(() => {
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(
      sevenDaysAgo.getDate() - 7
    );

    const recent = wishlist.filter(
      (item) =>
        new Date(item.addedAt) >=
        sevenDaysAgo
    ).length;

    const bookedVendorIds = new Set(
      bookings.map(
        (booking) => booking.vendorId
      )
    );

    const ready = wishlist.filter(
      (item) =>
        !bookedVendorIds.has(
          item.vendorId
        )
    ).length;

    return {
      totalSaved: wishlist.length,
      recentlyAdded: recent,
      readyToBook: ready,
    };
  }, [wishlist, bookings]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="
        relative
        overflow-hidden
        rounded-[32px]
        bg-gradient-to-br
        from-rose-500
        via-pink-500
        to-red-500
        p-8
        text-white
        shadow-xl
      "
    >
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-2">
        {/* Left */}

        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
            <Sparkles size={16} />

            <span className="text-sm font-medium">
              Your Wishlist
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            Vendors you've
            <br />
            fallen in love with.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-rose-100">
            Save your favorite vendors,
            compare them and book when
            you're ready.
          </p>

          <Link
            href="/vendors"
            className="
              mt-8
              inline-flex
              items-center
              gap-2
              rounded-2xl
              bg-white
              px-6
              py-4
              font-semibold
              text-rose-600
              transition
              hover:-translate-y-1
            "
          >
            Explore More Vendors

            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Right */}

        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <Bookmark size={22} />

            <h3 className="text-xl font-semibold">
              Wishlist Summary
            </h3>
          </div>

          <div className="mt-8 space-y-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Heart size={18} />

                Saved Vendors
              </span>

              <span className="font-semibold">
                {totalSaved}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>
                Recently Added
              </span>

              <span className="font-semibold">
                {recentlyAdded}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>
                Ready to Book
              </span>

              <span className="font-semibold">
                {readyToBook}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}