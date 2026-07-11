// "use client";

// const reviews = [
//   {
//     name: "Rahul",
//     rating: "★★★★★",
//     comment: "Amazing service!",
//   },
//   {
//     name: "Priya",
//     rating: "★★★★★",
//     comment: "Highly recommended.",
//   },
//   {
//     name: "Anjali",
//     rating: "★★★★☆",
//     comment: "Very professional.",
//   },
// ];

// export default function RecentReviews() {
//   return (
//     <section className="rounded-3xl border border-[#f4c8a0] bg-white/90 p-7 shadow-sm shadow-[#e4005a]/5">

//       <h2 className="text-xl font-bold text-[#4d1730]">
//         Recent Reviews
//       </h2>

//       <div className="mt-8 space-y-5">

//         {reviews.map((review) => (

//           <div
//             key={review.name}
//             className="rounded-2xl border border-[#ffe0a3] bg-[#fff8ef] p-5"
//           >

//             <div className="flex items-center justify-between">

//               <h3 className="font-semibold text-[#4d1730]">
//                 {review.name}
//               </h3>

//               <span className="text-[#ffb703]">
//                 {review.rating}
//               </span>

//             </div>

//             <p className="mt-3 text-sm text-[#946176]">
//               {review.comment}
//             </p>

//           </div>

//         ))}

//       </div>

//     </section>
//   );
// }
