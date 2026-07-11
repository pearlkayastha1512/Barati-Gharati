// "use client";

// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import PortfolioHero from "@/components/vendor/portfolio/PortfolioHero";
// import PortfolioStats from "@/components/vendor/portfolio/PortfolioStats";
// import PortfolioFilters from "@/components/vendor/portfolio/PortfolioFilters";
// import PortfolioGrid from "@/components/vendor/portfolio/PortfolioGrid";
// import UploadPortfolioCard from "@/components/vendor/portfolio/UploadPortfolioCard";
// import AddPortfolioModal from "@/components/vendor/portfolio/AddPortfolioModal";

// import { useAuthStore } from "@/store/authStore";
// import { usePortfolioStore } from "@/store/portfolioStore";

// import { getVendorByUserId } from "@/services/vendor.service";

// export default function VendorPortfolioPage() {
//   const [open, setOpen] =
//     useState(false);

//   const { user } =
//     useAuthStore();

//   const {
//     portfolio,
//     loadVendorPortfolio,
//   } =
//     usePortfolioStore();
//     console.log("Portfolio State:", portfolio);
//   const [search, setSearch] =
//     useState("");

//   const [category, setCategory] =
//     useState("All");

//  useEffect(() => {
//   async function loadPortfolio() {
//     const vendor = await getVendorByUserId();

//     if (!vendor) {
//       return;
//     }

//     console.log("Vendor:", vendor);

//     await loadVendorPortfolio(vendor.id);
//   }

//   loadPortfolio();
// }, [loadVendorPortfolio]);

//   const categories =
//     useMemo(
//       () => [
//         ...new Set(
//           portfolio.map(
//             (item) =>
//               item.category
//           )
//         ),
//       ],
//       [portfolio]
//     );

//   const filteredPortfolio =
//     useMemo(() => {
//       return portfolio.filter(
//         (item) => {
//           const matchesSearch =
//             item.title
//               .toLowerCase()
//               .includes(
//                 search.toLowerCase()
//               );

//           const matchesCategory =
//             category === "All" ||
//             item.category ===
//               category;

//           return (
//             matchesSearch &&
//             matchesCategory
//           );
//         }
//       );
//     }, [
//       portfolio,
//       search,
//       category,
//     ]);

//   return (
//     <div className="space-y-8">

//       <PortfolioHero
//         onUpload={() =>
//           setOpen(true)
//         }
//       />

//       <PortfolioStats />

//       <PortfolioFilters
//         search={search}
//         setSearch={setSearch}
//         category={category}
//         setCategory={setCategory}
//         categories={categories}
//       />

//       {/* <PortfolioGrid
//         portfolio={
//           filteredPortfolio
//         }
//         onEdit={() =>
//           setOpen(true)
//         }
//       /> */}

//       <PortfolioGrid
//   portfolio={portfolio}
//   onEdit={() => setOpen(true)}
// />

//       <UploadPortfolioCard
//         onCreate={() =>
//           setOpen(true)
//         }
//       />

//       <AddPortfolioModal
//         open={open}
//         onClose={() =>
//           setOpen(false)
//         }
//       />

//     </div>
//   );
// }

"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import PortfolioHero from "@/components/vendor/portfolio/PortfolioHero";
import PortfolioStats from "@/components/vendor/portfolio/PortfolioStats";
import PortfolioFilters from "@/components/vendor/portfolio/PortfolioFilters";
import PortfolioGrid from "@/components/vendor/portfolio/PortfolioGrid";
import UploadPortfolioCard from "@/components/vendor/portfolio/UploadPortfolioCard";
import AddPortfolioModal from "@/components/vendor/portfolio/AddPortfolioModal";

import { usePortfolioStore } from "@/store/portfolioStore";

export default function VendorPortfolioPage() {
  const [open, setOpen] =
    useState(false);

  const {
    portfolio,
    loading,
    loadPortfolio,
  } =
    usePortfolioStore();

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  // =====================================
  // Load Logged-in Vendor Portfolio
  // =====================================

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  // =====================================

  const categories =
    useMemo(
      () => [
        ...new Set(
          portfolio.map(
            (item) =>
              item.categories?.length
                ? item.categories
                : [item.category]
          )
          .flat()
        ),
      ],
      [portfolio]
    );

  const filteredPortfolio =
    useMemo(() => {
      return portfolio.filter(
        (item) => {
          const matchesSearch =
            item.title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesCategory =
            category === "All" ||
            (item.categories?.length
              ? item.categories
              : [item.category]
            ).some(
              (itemCategory) =>
                itemCategory === category
            );

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      portfolio,
      search,
      category,
    ]);

  return (
    <div className="space-y-8">

      <PortfolioHero
        onUpload={() =>
          setOpen(true)
        }
      />

      <PortfolioStats />

      <PortfolioFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        categories={categories}
      />

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          Loading Portfolio...
        </div>
      ) : (
        <PortfolioGrid
          portfolio={
            filteredPortfolio
          }
          onEdit={() =>
            setOpen(true)
          }
        />
      )}

      <UploadPortfolioCard
        onCreate={() =>
          setOpen(true)
        }
      />

      <AddPortfolioModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
      />

    </div>
  );
}
