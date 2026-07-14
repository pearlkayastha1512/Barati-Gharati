import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Expense } from "../../../store/budgetStore";
import { styles } from "../../../screens/couple/styles/BudgetScreen.styles";

type Props = {
  expense: Expense;
  onDelete: () => void;
};

export function ExpenseCard({ expense, onDelete }: Props) {
  return (
    <View style={styles.expenseCard}>
      <View style={styles.expenseIconCircle}>
        <MaterialIcons name="receipt-long" size={18} color="#FF4D6D" />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.expenseTitle}>{expense.title}</Text>
        <Text style={styles.expenseMeta}>
          {expense.category} · {new Date(expense.date).toLocaleDateString("en-IN")}
        </Text>
        {!!expense.note && <Text style={styles.expenseNote}>{expense.note}</Text>}
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.expenseAmount}>₹{expense.amount.toLocaleString("en-IN")}</Text>
        <TouchableOpacity onPress={onDelete}>
          <MaterialIcons name="delete-outline" size={18} color="#E63B5F" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
