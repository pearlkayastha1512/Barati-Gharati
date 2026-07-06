// "use client";

// import { useEffect } from "react";

// import { useAuthStore } from "@/store/authStore";
// import { useReviewStore } from "@/store/reviewStore";

// import { getVendorByUserId } from "@/services/vendor.service";

// import ReviewHero from "@/components/vendor/reviews/ReviewHero";
// import ReviewStats from "@/components/vendor/reviews/ReviewStats";
// import RatingSummary from "@/components/vendor/reviews/RatingSummary";
// import ReviewGrid from "@/components/vendor/reviews/ReviewGrid";

// export default function VendorReviewsPage() {
//   const { user } = useAuthStore();

//   const { loadVendorReviews } =
//     useReviewStore();

//   useEffect(() => {
//     if (!user) return;

//     const vendor = getVendorByUserId(user._id);

//     if (!vendor) return;

//     loadVendorReviews(vendor.id);
//   }, [user, loadVendorReviews]);

//   return (
//     <div className="space-y-8">
//       <ReviewHero />

//       <ReviewStats />

//       <section className="grid gap-6 xl:grid-cols-3">
//         <div className="xl:col-span-2">
//           <ReviewGrid />
//         </div>

//         <RatingSummary />
//       </section>
//     </div>
//   );
// }



"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/authStore";
import { useReviewStore } from "@/store/reviewStore";

import { getVendorByUserId } from "@/services/vendor.service";

import ReviewHero from "@/components/vendor/reviews/ReviewHero";
import ReviewStats from "@/components/vendor/reviews/ReviewStats";
import RatingSummary from "@/components/vendor/reviews/RatingSummary";
import ReviewGrid from "@/components/vendor/reviews/ReviewGrid";

export default function VendorReviewsPage() {
  const { user } = useAuthStore();

  const { loadVendorReviews } =
    useReviewStore();

  useEffect(() => {
    async function loadReviews() {
      if (!user) return;

      const vendor =
        await getVendorByUserId();

      if (!vendor) return;

      await loadVendorReviews(
        vendor.id
      );
    }

    loadReviews();
  }, [user, loadVendorReviews]);

  return (
    <div className="space-y-8">
      <ReviewHero />

      <ReviewStats />

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ReviewGrid />
        </div>

        <RatingSummary />
      </section>
    </div>
  );
}