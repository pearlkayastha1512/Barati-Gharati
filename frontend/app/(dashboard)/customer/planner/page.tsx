import PlannerHero from "@/components/planner/PlannerHero";
import ProgressOverview from "@/components/planner/ProgressOverview";
import Checklist from "@/components/planner/Checklist";
import Timeline from "@/components/planner/Timeline";
import BudgetCard from "@/components/planner/BudgetCard";
import VendorStatus from "@/components/planner/VendorStatus";
import UpcomingTasks from "@/components/planner/UpcomingTasks";

export default function PlannerPage() {
  return (
    <div className="space-y-8">

      <PlannerHero />

      <ProgressOverview />

      <section className="grid gap-6 xl:grid-cols-2">

        <Checklist />

        <Timeline />

      </section>

      <section className="grid gap-6 lg:grid-cols-2">

        <BudgetCard />

        <VendorStatus />

      </section>

      <UpcomingTasks />

    </div>
  );
}