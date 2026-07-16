import TeamCard from "./TeamCard";
import { teamMembers } from "./team-data";

export default function MeetTeam() {
  return (
    <section className="bg-[linear-gradient(145deg,#d77f9b_0%,#eeb3bc_50%,#f0c2b9_100%)] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <p className="font-semibold uppercase tracking-[0.4em] text-rose-500">
            OUR TEAM
          </p>

          <h2 className="mt-5 text-4xl font-bold text-gray-900 md:text-5xl">
            Meet The People
            <span className="block text-rose-500">
              Behind WedPlan
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            A passionate team committed to making wedding planning
            simpler, smarter and more memorable for every couple.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {teamMembers.map((member) => (
            <TeamCard
              key={member.id}
              {...member}
            />
          ))}

        </div>

      </div>

    </section>
  );
}
