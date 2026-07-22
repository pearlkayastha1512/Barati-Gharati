// "use client";

// import {
//   FileText,
//   ShieldCheck,
//   CreditCard,
//   CalendarCheck,
//   AlertTriangle,
//   Scale,
//   Flower2,
//   Heart,
//   Sparkles,
//   ScrollText,
// } from "lucide-react";

// import { termsSections } from "@/data/termsData";

// export default function TermsAndConditionsPage() {
//   return (
//     <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#fff1f2_0%,#fff7ed_20%,#fdf2f8_45%,#fef3c7_70%,#fff1f2_100%)] text-slate-800">
//       {/* Background */}

//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute left-[-180px] top-[-120px] h-[36rem] w-[36rem] rounded-full bg-rose-400/20 blur-3xl" />

//         <div className="absolute right-[-220px] top-[15%] h-[34rem] w-[34rem] rounded-full bg-pink-400/20 blur-3xl" />

//         <div className="absolute bottom-[-180px] left-[20%] h-[30rem] w-[30rem] rounded-full bg-amber-300/20 blur-3xl" />

//         <div className="absolute left-[7%] top-[12%] animate-pulse text-6xl opacity-25">
//           🌸
//         </div>

//         <div className="absolute right-[10%] top-[18%] animate-bounce text-5xl opacity-25">
//           💍
//         </div>

//         <div className="absolute left-[14%] bottom-[22%] animate-pulse text-5xl opacity-20">
//           🥂
//         </div>

//         <div className="absolute right-[12%] bottom-[18%] animate-bounce text-6xl opacity-20">
//           ❤️
//         </div>

//         <Flower2 className="absolute left-12 top-48 h-28 w-28 rotate-12 text-rose-300/30" />

//         <Flower2 className="absolute right-10 top-80 h-36 w-36 -rotate-12 text-pink-300/30" />

//         <Heart className="absolute left-1/4 top-24 h-12 w-12 text-rose-300/30" />

//         <Sparkles className="absolute right-1/3 top-36 h-12 w-12 text-amber-300/40" />

//         <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(255,255,255,0.45))]" />
//       </div>

//       {/* Hero */}

//       <section className="relative px-6 pb-24 pt-28">
//         <div className="mx-auto max-w-7xl text-center">
//           <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
//             <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 opacity-30 blur-2xl" />

//             <div className="absolute inset-3 rounded-full border border-rose-200" />

//             <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-[0_25px_80px_rgba(244,63,94,0.25)]">
//               <FileText className="h-14 w-14 text-rose-500" />
//             </div>
//           </div>

//           <p className="mt-8 text-xs font-bold uppercase tracking-[0.7em] text-rose-500">
//             Legal & Policies
//           </p>

//           <div className="mt-6 flex items-center justify-center gap-4 text-rose-400">
//             <Flower2 className="h-5 w-5" />
//             <Heart className="h-5 w-5 fill-rose-400" />
//             <Flower2 className="h-5 w-5" />
//           </div>

//           <h1 className="mt-6 bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 bg-clip-text font-serif text-6xl font-bold text-transparent md:text-8xl">
//             Terms & Conditions
//           </h1>

//           <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-slate-600">
//             Please read these Terms & Conditions carefully before using
//             Barati Gharati. They define your rights, responsibilities,
//             and obligations while using our platform.
//           </p>

//           <p className="mt-8 text-xl italic text-rose-500">
//             ✨ Transparency, trust & celebrations ✨
//           </p>

//           <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-rose-200 bg-white/80 px-8 py-4 text-sm font-medium text-rose-600 shadow-xl backdrop-blur-xl">
//             📜 Effective Date: 1 August 2026
//           </div>
//         </div>
//       </section>

//       {/* Quick Links */}

//       <section className="relative px-6">
//         <div className="mx-auto max-w-7xl">
//           <div className="mb-10 text-center">
//             <h2 className="font-serif text-4xl text-slate-900">
//               Explore Terms
//             </h2>

//             <p className="mt-3 text-slate-500">
//               Browse important legal sections.
//             </p>
//           </div>

//           <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
//             {termsSections.map((section) => (
//               <a
//                 key={section.id}
//                 href={`#${section.id}`}
//                 className="group relative overflow-hidden rounded-[30px] border border-white/60 bg-gradient-to-br from-white/90 via-rose-50 to-pink-100 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1 hover:shadow-[0_30px_80px_rgba(236,72,153,0.25)]"
//               >
//                 <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pink-200/30 blur-2xl" />

//                 <div className="absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-amber-200/30 blur-2xl" />

//                 <div className="relative z-10">
//                   <div className="flex items-center justify-between">
//                     <div className="rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 p-3 shadow-md">
//                       <ScrollText className="h-5 w-5 text-rose-500" />
//                     </div>

//                     <span className="text-2xl opacity-50 transition-all duration-300 group-hover:scale-125">
//                       ⚖️
//                     </span>
//                   </div>

//                   <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-rose-500">
//                     Section
//                   </p>

//                   <h3 className="mt-3 text-lg font-semibold text-slate-900 transition-colors group-hover:text-rose-600">
//                     {section.title}
//                   </h3>
//                 </div>
//               </a>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Terms Content */}

//       <section className="relative px-6 py-20">
//         <div className="mx-auto max-w-5xl space-y-10">
//           {termsSections.map((section) => (
//             <div
//               key={section.id}
//               id={section.id}
//               className="relative scroll-mt-32 overflow-hidden rounded-[38px] border border-rose-100 bg-gradient-to-br from-white via-rose-50/80 to-pink-100/70 p-8 shadow-[0_25px_70px_rgba(244,63,94,0.12)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_90px_rgba(244,63,94,0.18)] md:p-10"
//             >
//               <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400" />

//               <div className="mb-8 flex items-center gap-5">
//                 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 shadow-lg">
//                   <Scale className="h-8 w-8 text-rose-500" />
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
//                 {section.content.map(
//                   (item: string, index: number) => (
//                     <div
//                       key={index}
//                       className="group flex gap-5 rounded-3xl border border-rose-100 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 px-6 py-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
//                     >
//                       <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 via-pink-500 to-amber-400 text-white shadow-lg">
//                         ⚖️
//                       </div>

//                       <p className="leading-8 text-slate-700">
//                         {item}
//                       </p>
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>
//           ))}

//           {/* Footer */}

//           <div className="relative overflow-hidden rounded-[42px] bg-gradient-to-br from-rose-300 via-pink-200 to-amber-200 p-14 shadow-2xl">
//             <Flower2 className="absolute left-8 top-8 h-20 w-20 text-white/40" />

//             <Flower2 className="absolute bottom-8 right-8 h-20 w-20 text-white/40" />

//             <div className="relative z-10 text-center">
//               <div className="mb-8 flex justify-center gap-4 text-4xl">
//                 🌸 ⚖️ 📜 💍 ✨
//               </div>

//               <h2 className="font-serif text-5xl text-slate-900">
//                 Fairness & Transparency
//               </h2>

//               <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-slate-700">
//                 These Terms & Conditions govern the use of Barati
//                 Gharati and help ensure a secure, transparent, and
//                 reliable wedding marketplace experience.
//               </p>

//               <div className="mx-auto mt-10 h-px max-w-md bg-white/70" />

//               <p className="mt-8 text-sm text-slate-700">
//                 © 2026 Barati Gharati • A Brand of True Knock
//                 Industries Private Limited
//               </p>

//               <p className="mt-2 text-sm text-rose-700">
//                 Built with ❤️ for unforgettable celebrations
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

"use client";

import {
  Scale,
  FileText,
  Shield,
  ScrollText,
  Gavel,
} from "lucide-react";

import { termsSections } from "@/data/termsData";

export default function TermsAndConditionsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0F0F11] text-white">
      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-250px] top-[-200px] h-[38rem] w-[38rem] rounded-full bg-yellow-500/10 blur-3xl" />

        <div className="absolute right-[-220px] top-[10%] h-[34rem] w-[34rem] rounded-full bg-amber-400/10 blur-3xl" />

        <div className="absolute bottom-[-180px] left-[25%] h-[30rem] w-[30rem] rounded-full bg-orange-400/10 blur-3xl" />

        {/* Grid */}

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Floating icons */}

        <div className="absolute left-[10%] top-[20%] text-8xl opacity-[0.04]">
          ⚖️
        </div>

        <div className="absolute right-[15%] top-[40%] text-8xl opacity-[0.04]">
          📜
        </div>

        <div className="absolute bottom-[20%] left-[20%] text-8xl opacity-[0.04]">
          🛡️
        </div>

        <div className="absolute right-[18%] bottom-[15%] text-8xl opacity-[0.04]">
          🏛️
        </div>
      </div>

      {/* ================= HERO ================= */}

      <section className="relative px-6 pb-24 pt-28">
        <div className="mx-auto max-w-7xl text-center">
          <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-yellow-500/20 blur-3xl" />

            <div className="absolute inset-0 rounded-full border border-yellow-500/30" />

            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-yellow-500/40 bg-white/5 backdrop-blur-xl shadow-[0_0_80px_rgba(234,179,8,0.25)]">
              <Scale className="h-16 w-16 text-yellow-400" />
            </div>
          </div>

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.8em] text-yellow-400">
            Legal Agreement
          </p>

          <h1 className="mt-8 font-serif text-6xl font-bold tracking-wide text-yellow-400 md:text-8xl">
            Terms & Conditions
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-gray-300">
            These Terms & Conditions define the legal relationship,
            responsibilities, rights, and obligations between
            Barati Gharati, vendors, and users of the platform.
          </p>

          <p className="mt-8 text-lg italic text-yellow-300">
            ⚖️ Fairness • Transparency • Trust ⚖️
          </p>

          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-yellow-500/20 bg-white/5 px-8 py-4 text-sm font-medium text-yellow-300 backdrop-blur-xl">
            📜 Effective Date: 1 August 2026
          </div>
        </div>
      </section>

      {/* ================= QUICK LINKS ================= */}

      <section className="relative px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-4xl text-white">
              Explore Sections
            </h2>

            <p className="mt-3 text-gray-400">
              Browse important legal sections.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {termsSections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[30px]
                  border
                  border-yellow-500/20
                  bg-white/[0.03]
                  p-6
                  backdrop-blur-xl
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:border-yellow-400
                  hover:bg-white/[0.06]
                  hover:shadow-[0_25px_80px_rgba(234,179,8,0.15)]
                "
              >
                <div className="absolute right-5 top-5 text-5xl font-bold text-white/5">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10">
                  <ScrollText className="h-6 w-6 text-yellow-400" />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-500">
                  Section
                </p>

                <h3 className="mt-3 text-lg font-semibold text-white transition-colors duration-300 group-hover:text-yellow-300">
                  {section.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}

      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-5xl space-y-10">
          {termsSections.map(
            (section: {
              id: string;
              title: string;
              content: string[];
            }) => (
              <div
                key={section.id}
                id={section.id}
                className="
                  relative
                  scroll-mt-32
                  overflow-hidden
                  rounded-[34px]
                  border
                  border-yellow-500/15
                  bg-gradient-to-br
                  from-white/[0.03]
                  to-white/[0.01]
                  p-10
                  backdrop-blur-xl
                  transition-all
                  duration-500
                  hover:border-yellow-400/40
                  hover:shadow-[0_30px_100px_rgba(234,179,8,0.12)]
                "
              >
                <div className="absolute right-6 top-4 text-8xl font-bold text-white/[0.03]">
                  {section.title.split(".")[0]}
                </div>

                <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-yellow-500 via-amber-400 to-transparent" />

                <div className="mb-10 flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10">
                    <Gavel className="h-8 w-8 text-yellow-400" />
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.4em] text-yellow-500">
                      Legal Section
                    </p>

                    <h2 className="font-serif text-2xl text-white md:text-3xl">
                      {section.title}
                    </h2>
                  </div>
                </div>

                <div className="space-y-5">
                  {section.content.map(
                    (item: string, index: number) => (
                      <div
                        key={index}
                        className="
                          flex
                          gap-5
                          rounded-2xl
                          border
                          border-yellow-500/10
                          bg-black/20
                          px-6
                          py-5
                          transition-all
                          duration-300
                          hover:border-yellow-500/30
                          hover:bg-black/30
                        "
                      >
                        <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
                          ⚖️
                        </div>

                        <p className="leading-8 text-gray-300">
                          {item}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          )}

          {/* ================= FOOTER ================= */}

          <div className="relative overflow-hidden rounded-[42px] border border-yellow-500/20 bg-gradient-to-br from-[#171717] to-[#0D0D0D] p-16 shadow-2xl">
            <div className="absolute left-10 top-10 text-7xl opacity-5">
              📜
            </div>

            <div className="absolute right-10 bottom-10 text-7xl opacity-5">
              ⚖️
            </div>

            <div className="relative z-10 text-center">
              <div className="mb-8 flex justify-center gap-5 text-5xl">
                ⚖️ 📜 🛡️
              </div>

              <h2 className="font-serif text-5xl text-yellow-400">
                Legal Transparency
              </h2>

              <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-gray-300">
                These Terms & Conditions establish the legal
                framework governing the use of Barati Gharati and
                ensure fairness, transparency, and accountability
                for all users.
              </p>

              <div className="mx-auto mt-10 h-px max-w-md bg-yellow-500/30" />

              <p className="mt-8 text-sm text-gray-400">
                © 2026 Barati Gharati • True Knock Industries Pvt.
                Ltd.
              </p>

              <p className="mt-3 text-sm text-yellow-500">
                Built with trust and responsibility.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}