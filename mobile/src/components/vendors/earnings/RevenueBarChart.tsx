import React from "react";
import { View, Text } from "react-native";
import { CAL_COLORS } from "../../../constants/calendarTheme";
import { MonthlyRevenue } from "../../../store/vendorEarningsStore";

type Props = {
  data: MonthlyRevenue[];
};

export function RevenueBarChart({ data }: Props) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1); // avoid divide-by-zero
  const chartHeight = 160;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        height: chartHeight + 24,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: CAL_COLORS.paleDivider,
      }}
    >
      {data.map((item) => {
        const barHeight = Math.max((item.amount / maxAmount) * chartHeight, 4);
        return (
          <View key={item.month} style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
                width: "50%",
                height: barHeight,
                backgroundColor: item.amount > 0 ? CAL_COLORS.primary : CAL_COLORS.paleDivider,
                borderRadius: 4,
              }}
            />
            <Text style={{ fontSize: 10, color: CAL_COLORS.bodyRose, marginTop: 8, fontWeight: "600" }}>
              {item.month}
            </Text>
          </View>
        );
      })}
    </View>
  );
}