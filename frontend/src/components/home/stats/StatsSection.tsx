// import StatCard from "./StatCard";
// import { stats } from "./stats-data";

// export default function StatsSection() {
//   return (
//     <section className="relative overflow-hidden bg-white py-36">
//       {/* Background Glow */}

//       <div className="absolute inset-0">

//         <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-rose-100 blur-[120px]" />

//         <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-pink-100 blur-[140px]" />

//       </div>

//       <div className="relative mx-auto max-w-7xl px-6">

//         {/* Heading */}

//         <div className="text-center">

//           <p className="font-semibold uppercase tracking-[0.45em] text-rose-500">
//             OUR IMPACT
//           </p>

//           <div className="mt-5 flex items-center justify-center gap-4">

//             <div className="h-px w-24 bg-gradient-to-r from-transparent to-rose-300" />

//             <span className="text-rose-400">♥</span>

//             <div className="h-px w-24 bg-gradient-to-l from-transparent to-rose-300" />

//           </div>

//           <h2 className="mt-8 text-6xl font-black leading-tight text-gray-900">

//             Trusted by{" "}

//             <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
//               Thousands
//             </span>{" "}

//             of Couples

//           </h2>

//           <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-gray-600">
//             From finding the perfect venue to booking the finest wedding
//             professionals, we help couples create unforgettable celebrations
//             across India.
//           </p>

//         </div>

//         {/* Cards */}

//         <div className="mt-24 grid gap-12 md:grid-cols-2 xl:grid-cols-4">

//           {stats.map((stat) => (
//             <StatCard
//               key={stat.id}
//               value={stat.value}
//               title={stat.title}
//               subtitle={stat.subtitle}
//               icon={stat.icon}
//             />
//           ))}

//         </div>

//       </div>
//     </section>
//   );
// }

import StatCard from "./StatCard";
import { stats } from "./stats-data";

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#fff1e7] via-[#efb5c1] to-[#df8fa8] py-28">
      {/* Luxury Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-rose-400/35 blur-[140px]" />

        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-pink-400/30 blur-[160px]" />

        <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff0e5]/45 blur-[180px]" />

        {/* Decorative Blobs */}
        <div className="absolute left-12 top-24 h-5 w-5 rotate-12 rounded-full bg-rose-300 opacity-60 blur-sm" />
        <div className="absolute right-16 top-32 h-6 w-6 -rotate-12 rounded-full bg-pink-300 opacity-60 blur-sm" />
        <div className="absolute bottom-24 left-24 h-4 w-4 rounded-full bg-rose-400 opacity-50 blur-sm" />
        <div className="absolute bottom-16 right-32 h-5 w-5 rounded-full bg-pink-400 opacity-50 blur-sm" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-rose-500">
            OUR IMPACT
          </p>

          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-rose-300" />

            <span className="text-sm text-rose-400">♥</span>

            <div className="h-px w-20 bg-gradient-to-l from-transparent to-rose-300" />
          </div>

          <h2 className="mt-6 text-4xl font-black leading-tight text-gray-900 md:text-6xl">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 bg-clip-text text-transparent">
              Thousands
            </span>{" "}
            of Couples
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            From finding the perfect venue to booking the finest wedding
            professionals, we help couples create unforgettable celebrations
            across India.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mt-20 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              value={stat.value}
              title={stat.title}
              subtitle={stat.subtitle}
              icon={stat.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
