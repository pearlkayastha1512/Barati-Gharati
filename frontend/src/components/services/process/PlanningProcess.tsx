import PlanningCard from "./PlanningCard";
import { planningSteps } from "./planning-data";

export default function PlanningProcess() {
  return (
    <section className="bg-[linear-gradient(135deg,#efbbb9_0%,#dc8fa6_52%,#c96f8f_100%)] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <p className="font-semibold uppercase tracking-[0.35em] text-rose-500">
            HOW IT WORKS
          </p>

          <h2 className="mt-5 text-4xl font-bold text-gray-900 md:text-5xl">
            Plan Your Wedding
            <span className="block text-rose-500">
              In Four Easy Steps
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            From discovering vendors to celebrating your big day,
            we simplify every step of your wedding journey.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {planningSteps.map((step, index) => (
            <PlanningCard
              key={step.id}
              icon={step.icon}
              title={step.title}
              description={step.description}
              number={index + 1}
            />
          ))}

        </div>

      </div>

    </section>
  );
}
