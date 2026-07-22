// "use client";

// import {
//   Shield,
//   Heart,
//   Flower2,
//   Sparkles,
//   ScrollText,
// } from "lucide-react";
// import { privacySections } from "@/data/privacyData";

// export default function PrivacyPolicyPage() {
//   return (
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-rose-50 via-[#fffaf8] to-pink-50 text-slate-800">
//       {/* ================= BACKGROUND ================= */}

//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute left-[-180px] top-[-120px] h-[34rem] w-[34rem] rounded-full bg-rose-300/20 blur-3xl" />

//         <div className="absolute right-[-200px] top-[20%] h-[32rem] w-[32rem] rounded-full bg-pink-300/20 blur-3xl" />

//         <div className="absolute bottom-[-180px] left-[25%] h-[28rem] w-[28rem] rounded-full bg-amber-200/20 blur-3xl" />

//         <Flower2 className="absolute left-10 top-40 h-24 w-24 rotate-12 text-rose-200/40" />

//         <Flower2 className="absolute right-10 top-72 h-32 w-32 -rotate-12 text-pink-200/40" />

//         <Heart className="absolute left-1/4 top-24 h-10 w-10 text-rose-300/30" />

//         <Sparkles className="absolute right-1/3 top-40 h-12 w-12 text-amber-300/40" />

//         <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.6),transparent_60%)]" />
//       </div>

//       {/* ================= HERO ================= */}

//       <section className="relative px-6 pb-20 pt-28">
//         <div className="mx-auto max-w-7xl text-center">
//           <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
//             <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 opacity-30 blur-xl" />

//             <div className="absolute inset-3 rounded-full border border-rose-200" />

//             <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-[0_20px_60px_rgba(244,63,94,0.25)]">
//               <Shield className="h-12 w-12 text-rose-500" />
//             </div>
//           </div>

//           <p className="mt-8 text-xs font-semibold uppercase tracking-[0.6em] text-rose-500">
//             Privacy & Security
//           </p>

//           <div className="mt-6 flex items-center justify-center gap-3 text-rose-400">
//             <Flower2 className="h-5 w-5" />
//             <Heart className="h-5 w-5 fill-rose-400" />
//             <Flower2 className="h-5 w-5" />
//           </div>

//           <h1 className="mt-6 font-serif text-5xl text-slate-900 md:text-7xl">
//             Privacy Policy
//           </h1>

//           <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-slate-600">
//             Your privacy matters to us. This policy explains how
//             Barati Gharati collects, stores, protects, and processes
//             your information while you celebrate life’s most beautiful
//             moments with us.
//           </p>

//           <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-rose-200 bg-white/80 px-8 py-4 text-sm font-medium text-rose-600 shadow-lg backdrop-blur-xl">
//             💍 Effective Date: 1 August 2026
//           </div>
//         </div>
//       </section>

//       {/* ================= QUICK NAVIGATION ================= */}

//       <section className="relative px-6">
//         <div className="mx-auto max-w-7xl">
//           <div className="mb-8 text-center">
//             <h2 className="font-serif text-3xl text-slate-900">
//               Explore Policy Sections
//             </h2>

//             <p className="mt-3 text-slate-500">
//               Everything you need to know about privacy and security.
//             </p>
//           </div>

//           <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
//             {privacySections.map((section) => (
//               <a
//                 key={section.id}
//                 href={`#${section.id}`}
//                 className="group rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(244,63,94,0.15)]"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 p-3">
//                     <ScrollText className="h-5 w-5 text-rose-500" />
//                   </div>

//                   <span className="text-xl opacity-40 transition-all duration-300 group-hover:scale-125">
//                     💐
//                   </span>
//                 </div>

//                 <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-rose-500">
//                   Section
//                 </p>

//                 <h3 className="mt-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-rose-600">
//                   {section.title}
//                 </h3>
//               </a>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= POLICY SECTIONS ================= */}

//       <section className="relative px-6 py-20">
//         <div className="mx-auto max-w-5xl space-y-10">
//           {privacySections.map((section) => (
//             <div
//               key={section.id}
//               id={section.id}
//               className="scroll-mt-32 overflow-hidden rounded-[36px] border border-rose-100 bg-white/90 p-8 shadow-[0_25px_70px_rgba(244,63,94,0.10)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_90px_rgba(244,63,94,0.16)] md:p-10"
//             >
//               <div className="mb-8 flex items-center gap-5">
//                 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 shadow-md">
//                   <ScrollText className="h-8 w-8 text-rose-500" />
//                 </div>

//                 <div>
//                   <div className="mb-2 flex gap-1 text-sm text-rose-300">
//                     ✿ ❀ ♥ ❀ ✿
//                   </div>

//                   <h2 className="font-serif text-2xl text-slate-900 md:text-3xl">
//                     {section.title}
//                   </h2>
//                 </div>
//               </div>

//               <div className="space-y-5">
//                 {section.content.map((item, index) => (
//                   <div
//                     key={index}
//                     className="group flex gap-5 rounded-3xl border border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-5 transition-all duration-300 hover:scale-[1.02]"
//                   >
//                     <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-md">
//                       💐
//                     </div>

//                     <p className="leading-8 text-slate-700">{item}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}

//           {/* ================= FOOTER ================= */}

//           <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 p-12 shadow-2xl">
//             <Flower2 className="absolute left-8 top-8 h-16 w-16 text-rose-200" />

//             <Flower2 className="absolute bottom-8 right-8 h-16 w-16 text-pink-200" />

//             <Heart className="absolute left-1/2 top-6 h-8 w-8 -translate-x-1/2 text-rose-200" />

//             <div className="relative z-10 text-center">
//               <div className="mb-6 flex justify-center gap-3 text-2xl">
//                 💐 ❤️ 💍 ✨ 🥂
//               </div>

//               <h2 className="font-serif text-4xl text-slate-900">
//                 Your Privacy, Our Promise
//               </h2>

//               <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-600">
//                 Barati Gharati is committed to protecting your
//                 memories, celebrations, and personal information while
//                 helping you discover trusted wedding vendors and
//                 services.
//               </p>

//               <div className="mx-auto mt-8 h-px max-w-md bg-rose-200" />

//               <p className="mt-8 text-sm text-slate-500">
//                 © 2026 Barati Gharati • A Brand of True Knock
//                 Industries Private Limited
//               </p>

//               <p className="mt-2 text-xs text-rose-500">
//                 Made with ❤️ for unforgettable weddings & celebrations
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

"use client";

import {
  Shield,
  Heart,
  Flower2,
  Sparkles,
  ScrollText,
} from "lucide-react";
import {
  privacySections,
  type PrivacySection,
} from "@/data/privacyData";

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#fff1f2_0%,#fff7ed_20%,#fdf2f8_45%,#fef3c7_70%,#fff1f2_100%)] text-slate-800">
      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient blobs */}

        <div className="absolute left-[-180px] top-[-120px] h-[36rem] w-[36rem] rounded-full bg-rose-400/20 blur-3xl" />

        <div className="absolute right-[-220px] top-[15%] h-[34rem] w-[34rem] rounded-full bg-pink-400/20 blur-3xl" />

        <div className="absolute bottom-[-180px] left-[20%] h-[30rem] w-[30rem] rounded-full bg-amber-300/20 blur-3xl" />

        {/* Floating emojis */}

        <div className="absolute left-[7%] top-[12%] animate-pulse text-6xl opacity-25">
          🌸
        </div>

        <div className="absolute right-[10%] top-[18%] animate-bounce text-5xl opacity-25">
          💍
        </div>

        <div className="absolute left-[14%] bottom-[22%] animate-pulse text-5xl opacity-20">
          🥂
        </div>

        <div className="absolute right-[12%] bottom-[18%] animate-bounce text-6xl opacity-20">
          ❤️
        </div>

        <div className="absolute left-1/2 top-[40%] animate-pulse text-4xl opacity-10">
          ✨
        </div>

        <div className="absolute right-[28%] top-[62%] animate-pulse text-5xl opacity-15">
          🎊
        </div>

        {/* Decorative icons */}

        <Flower2 className="absolute left-12 top-48 h-28 w-28 rotate-12 text-rose-300/30" />

        <Flower2 className="absolute right-10 top-80 h-36 w-36 -rotate-12 text-pink-300/30" />

        <Heart className="absolute left-1/4 top-24 h-12 w-12 text-rose-300/30" />

        <Sparkles className="absolute right-1/3 top-36 h-12 w-12 text-amber-300/40" />

        {/* Overlay */}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(255,255,255,0.45))]" />
      </div>

      {/* ================= HERO ================= */}

      <section className="relative px-6 pb-24 pt-28">
        <div className="mx-auto max-w-7xl text-center">
          <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 opacity-30 blur-2xl" />

            <div className="absolute inset-3 rounded-full border border-rose-200" />

            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-[0_25px_80px_rgba(244,63,94,0.25)]">
              <Shield className="h-14 w-14 text-rose-500" />
            </div>
          </div>

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.7em] text-rose-500">
            Privacy & Security
          </p>

          <div className="mt-6 flex items-center justify-center gap-4 text-rose-400">
            <Flower2 className="h-5 w-5" />
            <Heart className="h-5 w-5 fill-rose-400" />
            <Flower2 className="h-5 w-5" />
          </div>

          <h1 className="mt-6 bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 bg-clip-text font-serif text-6xl font-bold text-transparent md:text-8xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-slate-600">
            Your privacy matters to us. This policy explains how
            Barati Gharati collects, stores, protects, and processes
            your information while you celebrate life's most beautiful
            moments with us.
          </p>

          <p className="mt-8 text-xl italic text-rose-500">
            ✨ Protecting your beautiful celebrations and memories ✨
          </p>

          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-rose-200 bg-white/80 px-8 py-4 text-sm font-medium text-rose-600 shadow-xl backdrop-blur-xl">
            💍 Effective Date: 1 August 2026
          </div>
        </div>
      </section>

      {/* ================= QUICK LINKS ================= */}

      <section className="relative px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-4xl text-slate-900">
              Explore Policy Sections
            </h2>

            <p className="mt-3 text-slate-500">
              Everything you need to know about privacy and security.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {privacySections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group relative overflow-hidden rounded-[30px] border border-white/60 bg-gradient-to-br from-white/90 via-rose-50 to-pink-100 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1 hover:shadow-[0_30px_80px_rgba(236,72,153,0.25)]"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pink-200/30 blur-2xl" />

                <div className="absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-amber-200/30 blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 p-3 shadow-md">
                      <ScrollText className="h-5 w-5 text-rose-500" />
                    </div>

                    <span className="text-2xl opacity-50 transition-all duration-300 group-hover:scale-125">
                      💐
                    </span>
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-rose-500">
                    Section
                  </p>

                  <h3 className="mt-3 text-lg font-semibold text-slate-900 transition-colors group-hover:text-rose-600">
                    {section.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRIVACY CONTENT ================= */}

      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-5xl space-y-10">
          {privacySections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="relative scroll-mt-32 overflow-hidden rounded-[38px] border border-rose-100 bg-gradient-to-br from-white via-rose-50/80 to-pink-100/70 p-8 shadow-[0_25px_70px_rgba(244,63,94,0.12)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_90px_rgba(244,63,94,0.18)] md:p-10"
            >
              {/* Top border */}

              <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400" />

              {/* Heading */}

              <div className="mb-8 flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 shadow-lg">
                  <ScrollText className="h-8 w-8 text-rose-500" />
                </div>

                <div>
                  <div className="mb-2 flex gap-1 text-sm text-rose-300">
                    ✿ ❀ ♥ ❀ ✿
                  </div>

                  <h2 className="font-serif text-2xl text-slate-900 md:text-3xl">
                    {section.title}
                  </h2>
                </div>
              </div>

              {/* Content */}

              <div className="space-y-5">
                {section.content.map((item, index) => (
                  <div
                    key={index}
                    className="group flex gap-5 rounded-3xl border border-rose-100 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 px-6 py-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  >
                    <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 via-pink-500 to-amber-400 text-white shadow-lg">
                      ✨
                    </div>

                    <p className="leading-8 text-slate-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ================= FOOTER ================= */}

          <div className="relative overflow-hidden rounded-[42px] bg-gradient-to-br from-rose-300 via-pink-200 to-amber-200 p-14 shadow-2xl">
            <Flower2 className="absolute left-8 top-8 h-20 w-20 text-white/40" />

            <Flower2 className="absolute bottom-8 right-8 h-20 w-20 text-white/40" />

            <Heart className="absolute left-1/2 top-8 h-8 w-8 -translate-x-1/2 text-white/50" />

            <div className="relative z-10 text-center">
              <div className="mb-8 flex justify-center gap-4 text-4xl">
                🌸 💍 ❤️ 🥂 ✨ 🎊
              </div>

              <h2 className="font-serif text-5xl text-slate-900">
                Your Privacy, Our Promise
              </h2>

              <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-slate-700">
                Barati Gharati is committed to protecting your
                memories, celebrations, and personal information while
                helping you discover trusted wedding vendors and
                services.
              </p>

              <div className="mx-auto mt-10 h-px max-w-md bg-white/70" />

              <p className="mt-8 text-sm text-slate-700">
                © 2026 Barati Gharati • A Brand of True Knock
                Industries Private Limited
              </p>

              <p className="mt-2 text-sm text-rose-700">
                Made with ❤️ for unforgettable weddings &
                celebrations
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}