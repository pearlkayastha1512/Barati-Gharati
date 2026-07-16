import {
  FaClock,
  FaEnvelope,
  FaLocationDot,
  FaPaperPlane,
  FaPhone,
} from "react-icons/fa6";

export default function ContactForm() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#e6a0b1_0%,#f0beb9_52%,#d77e9a_100%)] py-24">
      {/* Background Glow */}
      <div className="absolute -left-32 top-20 h-[350px] w-[350px] rounded-full bg-rose-500/30 blur-[140px]" />
      <div className="absolute -right-32 bottom-10 h-[350px] w-[350px] rounded-full bg-pink-500/25 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* ================= LEFT ================= */}
          <div className="rounded-[36px] border border-gray-200 bg-white p-10 shadow-xl">
            <p className="font-semibold uppercase tracking-[0.35em] text-rose-500">
              SEND MESSAGE
            </p>

            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              We'd Love To Hear
              <span className="block text-rose-500">From You</span>
            </h2>

            <form className="mt-10 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="h-14 rounded-2xl border border-gray-300 px-5  text-gray-600 outline-none transition focus:border-rose-500"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  className="h-14 rounded-2xl border border-gray-300 px-5  text-gray-600 outline-none transition focus:border-rose-500"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="h-14 rounded-2xl border border-gray-300 px-5 outline-none transition focus:border-rose-500 text-gray-600"
                />

                <input
                  type="text"
                  placeholder="Subject"
                  className="h-14 rounded-2xl border border-gray-300 px-5 outline-none transition focus:border-rose-500 text-gray-600"
                />
              </div>

              <textarea
                rows={6}
                placeholder="Tell us how we can help..."
                className="w-full rounded-2xl border border-gray-300 p-5 outline-none transition focus:border-rose-500 text-gray-600"
              />

              <div className="flex justify-center">
  <button
    type="submit"
    className="
      inline-flex
      items-center
      justify-center
      gap-3
      rounded-full
      bg-gradient-to-r
      from-rose-500
      to-pink-500
      px-12
      py-4
      font-semibold
      text-white
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl
    "
  >
    <FaPaperPlane className="text-sm" />
    <span>Send Message</span>
  </button>
</div>
            </form>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="space-y-8">
            {/* Contact Card */}
            <div className="rounded-[32px] bg-white p-8 shadow-lg">
              <h3 className="text-3xl font-bold text-gray-900">
                Contact Information
              </h3>

              <p className="mt-4 leading-8 text-gray-600">
                Reach out to us anytime. Our wedding experts are happy to
                guide you through every step of your planning journey.
              </p>

              <div className="mt-8 space-y-6">
                {/* Phone */}
                <div className="flex gap-5">
                  <div className="rounded-2xl bg-rose-100 p-4">
                    <FaPhone className="text-xl text-rose-500" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="mt-1 text-gray-600">
                      +91 98765 43210
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-5">
                  <div className="rounded-2xl bg-rose-100 p-4">
                    <FaEnvelope className="text-xl text-rose-500" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="mt-1 text-gray-600">
                      hello@wedplan.com
                    </p>
                  </div>
                </div>

                {/* Office */}
                <div className="flex gap-5">
                  <div className="rounded-2xl bg-rose-100 p-4">
                    <FaLocationDot className="text-xl text-rose-500" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">Office</h4>
                    <p className="mt-1 text-gray-600">
                      Connaught Place,
                      <br />
                      New Delhi, India
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex gap-5">
                  <div className="rounded-2xl bg-rose-100 p-4">
                    <FaClock className="text-xl text-rose-500" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Business Hours
                    </h4>
                    <p className="mt-1 text-gray-600">
                      Monday - Saturday
                      <br />
                      9:00 AM – 7:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Placeholder */}
            <div className="overflow-hidden rounded-[32px] bg-white shadow-lg">
              <div className="flex h-72 items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
                <div className="text-center">
                  <FaLocationDot className="mx-auto text-5xl text-rose-500" />

                  <h3 className="mt-4 text-2xl font-bold text-gray-900">
                    Google Map
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Interactive map will be integrated during backend
                    deployment.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* ================= END RIGHT ================= */}
        </div>
      </div>
    </section>
  );
}
