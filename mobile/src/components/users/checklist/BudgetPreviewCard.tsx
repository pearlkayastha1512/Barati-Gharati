import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useBudgetStore } from "../../../store/budgetStore";
import { styles } from "../../../screens/couple/styles/ChecklistScreen.styles";

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function BudgetPreviewCard() {
  const navigation = useNavigation<any>();
  const totalBudget = useBudgetStore((state) => state.totalBudget);
  const expenses = useBudgetStore((state) => state.expenses);

  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = Math.max(totalBudget - spent, 0);
  const percentSpent = totalBudget > 0
    ? Math.min(Math.round((spent / totalBudget) * 100), 100)
    : 0;

  return (
    <TouchableOpacity
      style={styles.previewCard}
      onPress={() => navigation.navigate("Budget")}
      activeOpacity={0.8}
    >
      <View style={styles.previewCardHeader}>
        <View style={[styles.previewIconCircle, { backgroundColor: "#fff8d8" }]}>
          <MaterialIcons name="account-balance-wallet" size={18} color="#ff4d6d" />
        </View>
        <Text style={styles.previewCardTitle}>Wedding Budget</Text>
      </View>

      <View style={styles.previewStatRow}>
        <Text style={styles.previewStatLabel}>Spent</Text>
        <Text style={styles.previewStatValue}>{formatCurrency(spent)}</Text>
      </View>
      <View style={styles.previewStatRow}>
        <Text style={styles.previewStatLabel}>Remaining</Text>
        <Text style={styles.previewStatValue}>{formatCurrency(remaining)}</Text>
      </View>

      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${percentSpent}%`, backgroundColor: "#ff4d6d" }]} />
      </View>
      <Text style={styles.previewFootnote}>{percentSpent}% of total budget used</Text>
    </TouchableOpacity>
  );
}
