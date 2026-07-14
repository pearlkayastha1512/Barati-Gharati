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

      <View style={[styles.insightItem, { backgroundColor: "#FFE6EB" }]}>
        <MaterialIcons name="trending-up" size={18} color="#FF4D6D" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.insightLabel}>Highest Spending</Text>
          <Text style={styles.insightValue}>
            {highest ? `${highest.title} · ₹${highest.amount.toLocaleString("en-IN")}` : "No expenses yet"}
          </Text>
        </View>
      </View>

      <View style={[styles.insightItem, { backgroundColor: "#FFF5F7" }]}>
        <MaterialIcons name="show-chart" size={18} color="#FF4D6D" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.insightLabel}>Average Expense</Text>
          <Text style={styles.insightValue}>₹{Math.round(average).toLocaleString("en-IN")}</Text>
        </View>
      </View>

      <View style={[styles.insightItem, { backgroundColor: "#FFE6EB" }]}>
        <MaterialIcons name="warning-amber" size={18} color="#6C2D45" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.insightLabel}>Budget Health</Text>
          <Text style={styles.insightValue}>{percentUsed}% of your budget has been used.</Text>
        </View>
      </View>

      <View style={[styles.insightItem, { backgroundColor: "#FFF5F7" }]}>
        <MaterialIcons name="lightbulb-outline" size={18} color="#FF4D6D" />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.insightLabel}>Recommendation</Text>
          <Text style={styles.insightValue}>{recommendation}</Text>
        </View>
      </View>
    </View>
  );
}
