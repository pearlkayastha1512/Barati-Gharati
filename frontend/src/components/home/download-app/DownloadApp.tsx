import { CheckCircle } from "lucide-react";
import PhoneMockup from "./PhoneMockup";

export default function DownloadApp() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#d97f9b] via-[#f1bdc2] to-[#d77191] py-24">
      {/* Background Glow */}

      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-rose-500/25 blur-[140px]" />

        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-pink-500/25 blur-[140px]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">

        {/* Left */}

        <div>

          <p className="font-semibold uppercase tracking-[0.35em] text-rose-500">
            MOBILE APP
          </p>

          <h2 className="mt-6 text-4xl font-bold leading-tight text-gray-900 lg:text-6xl">
            Plan Your Dream Wedding
            <span className="block text-rose-500">
              Anytime, Anywhere
            </span>
          </h2>

          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-600">
            Search vendors, manage your wedding budget,
            track bookings and organize every detail —
            all from one beautiful mobile experience.
          </p>

          {/* Features */}

          <div className="mt-10 space-y-5">

            {[
              "Discover Verified Vendors",
              "Wedding Budget Tracker",
              "Instant Booking",
              "Wedding Checklist",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4"
              >
                <CheckCircle
                  size={22}
                  className="text-rose-500"
                />

                <span className="text-lg text-gray-700">
                  {item}
                </span>

              </div>
            ))}

          </div>

          {/* Buttons */}

          <div className="mt-12 flex flex-wrap gap-5">

            <button
              className="
              rounded-2xl
              bg-black
              px-8
              py-4
              text-left
              text-white
              transition
              hover:scale-105
            "
            >
              <p className="text-xs">
                Download on the
              </p>

              <h3 className="text-lg font-semibold">
                App Store
              </h3>

            </button>

            <button
              className="
              rounded-2xl
              bg-black
              px-8
              py-4
              text-left
              text-white
              transition
              hover:scale-105
            "
            >
              <p className="text-xs">
                Get it on
              </p>

              <h3 className="text-lg font-semibold">
                Google Play
              </h3>

            </button>

          </div>

        </div>

        {/* Right */}

        <PhoneMockup />

      </div>
    </section>
  );
}
