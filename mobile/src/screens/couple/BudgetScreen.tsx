import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useBudgetStore } from "../../store/budgetStore";
import { BudgetHeroCard } from "../../components/users/budget/BudgetHeroCard";
import { BudgetStatCard } from "../../components/users/budget/BudgetStatCard";
import { ExpenseCard } from "../../components/users/budget/ExpenseCard";
import { AddExpenseModal } from "../../components/users/budget/AddExpenseModal";
import { BudgetInsights } from "../../components/users/budget/BudgetInsights";
import { styles } from "./styles/BudgetScreen.styles";
import { MonthlyExpenseChart } from "../../components/users/budget/MonthlyExpenseChart";

// TODO: import API functions once backend is connected
// import { getBudgetSummary, createOrUpdateBudget, createExpense, deleteExpense } from "../../api/budget.api";

export default function BudgetScreen() {
  const navigation = useNavigation<any>();
  const { totalBudget, expenses, addExpense, removeExpense } = useBudgetStore();
  const [modalVisible, setModalVisible] = useState(false);

  // TODO: fetch on mount once backend connected
  // useEffect(() => {
  //   const load = async () => {
  //     const res = await getBudgetSummary();
  //     // populate store from res.data
  //   };
  //   load();
  // }, []);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const categoryTotals = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const maxCategoryAmount = Math.max(1, ...Object.values(categoryTotals));

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wedding Budget</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <BudgetHeroCard
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          transactionCount={expenses.length}
          // TODO: open an "Edit Budget" modal/prompt to call setTotalBudget with a new value
          onEditBudget={() => {}}
        />

        <View style={styles.statsGrid}>
          <BudgetStatCard
            icon="account-balance-wallet"
            iconColor="#22B07D"
            iconBg="#E8F8F0"
            label="Total Budget"
            value={`₹${totalBudget.toLocaleString("en-IN")}`}
            sublabel="Wedding Budget"
          />
          <BudgetStatCard
            icon="trending-down"
            iconColor="#E53935"
            iconBg="#FDEAEA"
            label="Spent"
            value={`₹${totalSpent.toLocaleString("en-IN")}`}
            sublabel={`${percentUsed}% of budget used`}
          />
          <BudgetStatCard
            icon="savings"
            iconColor="#3B82F6"
            iconBg="#EAF1FE"
            label="Remaining"
            value={`₹${remaining.toLocaleString("en-IN")}`}
            sublabel="Available Budget"
          />
          <BudgetStatCard
            icon="receipt-long"
            iconColor="#D9A404"
            iconBg="#FEF6E0"
            label="Transactions"
            value={`${expenses.length}`}
            sublabel="Expenses Added"
          />
        </View>

        {/* Expense Manager */}
        <View style={styles.managerCard}>
          <View style={styles.managerTopRow}>
            <View>
              <View style={styles.managerTitleRow}>
                <MaterialIcons name="request-quote" size={20} color="#22B07D" />
                <Text style={styles.managerTitle}>Expense Manager</Text>
              </View>
              <Text style={styles.managerSubtitle}>Add and manage your wedding expenses.</Text>
            </View>
            <TouchableOpacity style={styles.addExpenseButton} onPress={() => setModalVisible(true)}>
              <MaterialIcons name="add" size={16} color="#fff" />
              <Text style={styles.addExpenseButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Expense History */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Expense History</Text>
        </View>
        <Text style={styles.sectionSubtitle}>Manage all your wedding expenses.</Text>

        {expenses.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyBoxText}>No expenses added yet.</Text>
          </View>
        ) : (
          expenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} onDelete={() => removeExpense(expense.id)} />
          ))
        )}

        {/* Expense Categories */}
        <View style={styles.categoryCard}>
          <Text style={styles.sectionTitle}>Expense Categories</Text>
          <Text style={[styles.sectionSubtitle, { marginHorizontal: 0 }]}>Spending distribution by category.</Text>

          {Object.keys(categoryTotals).length === 0 ? (
            <Text style={styles.emptyBoxText}>No expenses added yet.</Text>
          ) : (
            Object.entries(categoryTotals).map(([cat, amount]) => (
              <View key={cat}>
                <View style={styles.categoryRow}>
                  <Text style={styles.categoryRowLabel}>{cat}</Text>
                  <Text style={styles.categoryRowValue}>₹{amount.toLocaleString("en-IN")}</Text>
                </View>
                <View style={styles.categoryBarTrack}>
                  <View
                    style={[styles.categoryBarFill, { width: `${(amount / maxCategoryAmount) * 100}%` }]}
                  />
                </View>
              </View>
            ))
          )}
        </View>
         {/* Monthly Expense Analytics — NEW */}
        <MonthlyExpenseChart expenses={expenses} />

        {/* Budget Insights */}
        <BudgetInsights expenses={expenses} totalBudget={totalBudget} totalSpent={totalSpent} />
      </ScrollView>

      <AddExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(data) => addExpense(data)}
      />
    </SafeAreaView>
  );
}