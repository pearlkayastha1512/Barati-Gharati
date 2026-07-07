import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Expense } from "../../../store/budgetStore";
import { styles } from "../../../screens/couple/styles/BudgetScreen.styles";

type Props = {
  expenses: Expense[];
  totalBudget: number;
  totalSpent: number;
};

export function BudgetInsights({ expenses, totalBudget, totalSpent }: Props) {
  const highest = expenses.length > 0 ? expenses.reduce((a, b) => (a.amount > b.amount ? a : b)) : null;
  const average = expenses.length > 0 ? totalSpent / expenses.length : 0;
  const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const recommendation =
    percentUsed < 50
      ? "Your spending is healthy. Continue tracking expenses to stay within budget."
      : percentUsed < 85
      ? "You're approaching your budget limit. Review upcoming expenses carefully."
      : "You're close to or over budget. Consider revisiting your remaining vendor bookings.";

  return (
    <View style={styles.insightsCard}>
      <Text style={styles.sectionTitle}>Budget Insights</Text>
      <Text style={styles.sectionSubtitle}>Smart insights from your wedding expenses.</Text>

      <View style={[styles.insightItem, { backgroundColor: "#E8F8F0" }]}>
        <MaterialIcons name="trending-up" size={18} color="#22B07D" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.insightLabel}>Highest Spending</Text>
          <Text style={styles.insightValue}>
            {highest ? `${highest.title} · ₹${highest.amount.toLocaleString("en-IN")}` : "No expenses yet"}
          </Text>
        </View>
      </View>

      <View style={[styles.insightItem, { backgroundColor: "#EAF1FE" }]}>
        <MaterialIcons name="show-chart" size={18} color="#3B82F6" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.insightLabel}>Average Expense</Text>
          <Text style={styles.insightValue}>₹{Math.round(average).toLocaleString("en-IN")}</Text>
        </View>
      </View>

      <View style={[styles.insightItem, { backgroundColor: "#FEF6E0" }]}>
        <MaterialIcons name="warning-amber" size={18} color="#D9A404" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.insightLabel}>Budget Health</Text>
          <Text style={styles.insightValue}>{percentUsed}% of your budget has been used.</Text>
        </View>
      </View>

      <View style={[styles.insightItem, { backgroundColor: "#F3E8FE" }]}>
        <MaterialIcons name="lightbulb-outline" size={18} color="#9333EA" />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.insightLabel}>Recommendation</Text>
          <Text style={styles.insightValue}>{recommendation}</Text>
        </View>
      </View>
    </View>
  );
}