import BudgetHero from "@/components/budget/BudgetHero";
import BudgetSummary from "@/components/budget/BudgetSummary";
import BudgetActions from "@/components/budget/BudgetActions";
import ExpenseChart from "@/components/budget/ExpenseChart";
import ExpenseCategories from "@/components/budget/ExpenseCategories";
import RecentExpenses from "@/components/budget/RecentExpenses";
import BudgetInsights from "@/components/budget/BudgetInsights";
import ExpenseTable from "@/components/budget/ExpenseTable";

export default function BudgetPage() {
  return (
    <div className="space-y-8">
      <BudgetHero />

      <BudgetSummary />

      {/* Expense Manager */}
      <BudgetActions />
  

  <ExpenseTable />
      {/* Analytics */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ExpenseChart />
        </div>

        <ExpenseCategories />
      </section>

      {/* Recent Expenses + Insights */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentExpenses />
        </div>

        <BudgetInsights />
      </section>
    </div>
  );
}