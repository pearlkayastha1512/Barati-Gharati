import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/couple/styles/BudgetScreen.styles";

type Props = {
  totalBudget: number;
  totalSpent: number;
  transactionCount: number;
  onEditBudget: () => void;
};

export function BudgetHeroCard({ totalBudget, totalSpent, transactionCount, onEditBudget }: Props) {
  const remaining = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <View style={styles.heroCard}>
      <View style={styles.heroBadge}>
        <MaterialIcons name="account-balance-wallet" size={14} color="#fff" />
        <Text style={styles.heroBadgeText}>Wedding Budget</Text>
      </View>

      <Text style={styles.heroTitle}>Keep every{"\n"}expense under control.</Text>
      <Text style={styles.heroSubtitle}>
        Track spending, monitor your remaining budget, and make smarter wedding planning decisions.
      </Text>

      <View style={styles.heroOverviewCard}>
        <View style={styles.heroOverviewHeader}>
          <Text style={styles.heroOverviewTitle}>₹ Budget Overview</Text>
          <TouchableOpacity onPress={onEditBudget}>
            <MaterialIcons name="edit" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroOverviewRow}>
          <Text style={styles.heroOverviewLabel}>Total Budget</Text>
          <Text style={styles.heroOverviewValue}>₹{totalBudget.toLocaleString("en-IN")}</Text>
        </View>
        <View style={styles.heroOverviewRow}>
          <Text style={styles.heroOverviewLabel}>Total Expenses</Text>
          <Text style={styles.heroOverviewValue}>₹{totalSpent.toLocaleString("en-IN")}</Text>
        </View>
        <View style={styles.heroOverviewRow}>
          <Text style={styles.heroOverviewLabel}>Transactions</Text>
          <Text style={styles.heroOverviewValue}>{transactionCount}</Text>
        </View>
        <View style={styles.heroOverviewRow}>
          <Text style={styles.heroOverviewLabel}>Budget Remaining</Text>
          <Text style={styles.heroOverviewValue}>₹{remaining.toLocaleString("en-IN")}</Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={styles.heroOverviewRow}>
            <Text style={styles.heroOverviewLabel}>Budget Used</Text>
            <Text style={styles.heroOverviewValue}>{percentUsed}%</Text>
          </View>
          <View style={styles.heroProgressTrack}>
            <View style={[styles.heroProgressFill, { width: `${Math.min(percentUsed, 100)}%` }]} />
          </View>
        </View>
      </View>
    </View>
  );
}