import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Expense } from "../../../store/budgetStore";
import { styles } from "../../../screens/couple/styles/BudgetScreen.styles";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Props = {
  expenses: Expense[];
};

export function MonthlyExpenseChart({ expenses }: Props) {
  const monthlyTotals = new Array(12).fill(0);
  expenses.forEach((e) => {
    const monthIndex = new Date(e.date).getMonth();
    monthlyTotals[monthIndex] += e.amount;
  });

  const maxAmount = Math.max(1, ...monthlyTotals);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const amountsWithExpenses = expenses.map((e) => e.amount);
  const highest = amountsWithExpenses.length > 0 ? Math.max(...amountsWithExpenses) : null;
  const lowest = amountsWithExpenses.length > 0 ? Math.min(...amountsWithExpenses) : null;

  return (
    <View style={styles.categoryCard}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View>
          <Text style={styles.sectionTitle}>Expense Analytics</Text>
          <Text style={[styles.sectionSubtitle, { marginHorizontal: 0 }]}>Monthly wedding spending.</Text>
        </View>
        <View style={styles.liveBadge}>
          <MaterialIcons name="trending-up" size={12} color="#22B07D" />
          <Text style={[styles.liveBadgeText, { marginLeft: 3 }]}>₹{totalSpent.toLocaleString("en-IN")}</Text>
        </View>
      </View>

      {/* Bar chart */}
      <View style={{ flexDirection: "row", alignItems: "flex-end", height: 90, marginTop: 20, marginBottom: 8 }}>
        {monthlyTotals.map((amount, index) => (
          <View key={MONTHS[index]} style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
                width: "60%",
                height: Math.max(4, (amount / maxAmount) * 80),
                backgroundColor: amount > 0 ? "#22B07D" : "#eee",
                borderRadius: 4,
              }}
            />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row" }}>
        {MONTHS.map((month) => (
          <Text key={month} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#999" }}>
            {month}
          </Text>
        ))}
      </View>

      {/* Highest / Lowest */}
      <View style={{ flexDirection: "row", marginTop: 20, gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: "#999" }}>Highest Expense</Text>
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#333", marginTop: 4 }}>
            {highest !== null ? `₹${highest.toLocaleString("en-IN")}` : "-"}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: "#999" }}>Lowest Expense</Text>
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#333", marginTop: 4 }}>
            {lowest !== null ? `₹${lowest.toLocaleString("en-IN")}` : "-"}
          </Text>
        </View>
      </View>
    </View>
  );
}