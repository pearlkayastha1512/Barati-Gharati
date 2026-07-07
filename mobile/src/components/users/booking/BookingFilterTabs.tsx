import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "../../../screens/couple/styles/BookingScreen.styles";

export type FilterKey = "All" | "Upcoming" | "Pending" | "Completed" | "Cancelled";

type Props = {
  activeFilter: FilterKey;
  onSelect: (filter: FilterKey) => void;
  counts: Record<FilterKey, number>;
};

const FILTERS: FilterKey[] = ["All", "Upcoming", "Pending", "Completed", "Cancelled"];

export function BookingFilterTabs({ activeFilter, onSelect, counts }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabsRow}>
      {FILTERS.map((filter) => {
        const isActive = filter === activeFilter;
        return (
          <TouchableOpacity
            key={filter}
            style={[styles.filterTab, isActive && styles.filterTabActive]}
            onPress={() => onSelect(filter)}
          >
            <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
              {filter}
            </Text>
            <View style={[styles.filterTabCount, isActive && styles.filterTabCountActive]}>
              <Text style={[styles.filterTabCountText, isActive && styles.filterTabCountTextActive]}>
                {counts[filter]}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}