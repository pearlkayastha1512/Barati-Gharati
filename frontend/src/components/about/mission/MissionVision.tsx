import MissionCard from "./MissionCard";
import { missionData } from "./mission-data";

export default function MissionVision() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(145deg,#d9829d_0%,#eeb2bc_50%,#efc0b8_100%)] py-24">

      {/* Background Glow */}

      <div className="absolute -left-40 top-10 h-[400px] w-[400px] rounded-full bg-rose-500/30 blur-[140px]" />

      <div className="absolute -right-40 bottom-10 h-[400px] w-[400px] rounded-full bg-pink-500/25 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <p className="font-semibold uppercase tracking-[0.4em] text-rose-500">
            MISSION & VISION
          </p>

          <h2 className="mt-5 text-4xl font-bold text-gray-900 md:text-5xl">
            Driven By Purpose,
            <span className="block text-rose-500">
              Inspired By Love
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Everything we build is designed to make wedding planning
            easier, more transparent and more enjoyable for every couple.
          </p>

        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">

          {missionData.map((item) => (
            <MissionCard
              key={item.id}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}

        </div>

      </div>

    </section>
  );
}
