import React, { useState ,useEffect} from "react";
import { ScrollView, View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { COLORS } from "../../constants/theme";
import { CAL_COLORS } from "../../constants/calendarTheme";
import { useVendorEarningsStore } from "../../store/vendorEarningsStore";
import { StatCard } from "../../components/vendors/dashboard/StatCard";
import { SectionCard } from "../../components/vendors/dashboard/SectionCard";
import { EmptyState } from "../../components/vendors/dashboard/EmptyState";
import { RevenueBarChart } from "../../components/vendors/earnings/RevenueBarChart";

import { styles } from "./vendorEarningsStyles";
import { payoutModalStyles } from "./payoutModalStyles";

const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function VendorEarningsScreen() {
  const navigation = useNavigation<any>();
  const [payoutModalVisible, setPayoutModalVisible] = useState(false);

  const {
    totalRevenue,
    thisMonthRevenue,
    pendingAmount,
    averageBooking,
    highestMonth,
    lowestMonth,
    monthlyAverage,
    monthlyRevenue,
    nextPayout,
    recentTransactions,
    fetchEarnings,
    isLoading,
  } = useVendorEarningsStore();

  useEffect(() => {
    fetchEarnings();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero header */}
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.heroPill}>
            <MaterialCommunityIcons name="chart-box-outline" size={13} color="#fff" />
            <Text style={styles.heroPillText}>Earnings Dashboard</Text>
          </View>
          <Text style={styles.heroTitle}>Track your{"\n"}business revenue.</Text>
          <Text style={styles.heroSubtitle}>
            Monitor earnings, customer payments, pending balances and monthly growth.
          </Text>

          <View style={styles.heroStatsRow}>
            <View>
              <Text style={styles.heroStatLabel}>Total Revenue</Text>
              <Text style={styles.heroStatValue}>{formatCurrency(totalRevenue)}</Text>
            </View>
            <View>
              <Text style={styles.heroStatLabel}>This Month</Text>
              <Text style={styles.heroStatValue}>{formatCurrency(thisMonthRevenue)}</Text>
            </View>
          </View>

          <View style={styles.pendingBox}>
            <View style={styles.pendingIconBox}>
              <MaterialCommunityIcons name="credit-card-outline" size={18} color="#fff" />
            </View>
            <Text style={styles.pendingLabel}>Pending Payments</Text>
            <Text style={styles.pendingValue}>{formatCurrency(pendingAmount)}</Text>
            <Text style={styles.pendingSubtext}>Remaining amount to be collected from customers.</Text>
          </View>
        </LinearGradient>

        {/* Stat Cards */}
        <View style={styles.grid}>
          <StatCard icon="cash-multiple" label="Total Revenue" value={formatCurrency(totalRevenue)} sublabel="All time" />
          <StatCard icon="calendar-month-outline" label="This Month" value={formatCurrency(thisMonthRevenue)} sublabel="Current period" />
          <StatCard icon="clock-outline" label="Pending" value={formatCurrency(pendingAmount)} sublabel="Awaiting payment" />
          <StatCard icon="receipt" label="Avg. Booking" value={formatCurrency(averageBooking)} sublabel="Per booking" />
        </View>

        {/* Revenue Overview */}
        <SectionCard title="Revenue Overview" subtitle="Monthly revenue comparison for the current year">
          <View style={styles.miniStatsRow}>
            <View style={[styles.miniStat, { backgroundColor: "#EEF2FF" }]}>
              <View style={[styles.miniStatIconBox, { backgroundColor: "#E0E7FF" }]}>
                <MaterialCommunityIcons name="briefcase-outline" size={14} color={COLORS.primary} />
              </View>
              <Text style={styles.miniStatLabel}>Total Revenue</Text>
              <Text style={styles.miniStatValue}>{formatCurrency(totalRevenue)}</Text>
              <Text style={styles.miniStatSublabel}>Current Year</Text>
            </View>

            <View style={[styles.miniStat, { backgroundColor: CAL_COLORS.available + "1A" }]}>
              <View style={[styles.miniStatIconBox, { backgroundColor: "#DCFCE7" }]}>
                <MaterialCommunityIcons name="trending-up" size={14} color={CAL_COLORS.available} />
              </View>
              <Text style={styles.miniStatLabel}>Highest Month</Text>
              <Text style={styles.miniStatValue}>{formatCurrency(highestMonth.amount)}</Text>
              <Text style={styles.miniStatSublabel}>{highestMonth.month}</Text>
            </View>

            <View style={[styles.miniStat, { backgroundColor: "#F3E8FF" }]}>
              <View style={[styles.miniStatIconBox, { backgroundColor: "#E9D5FF" }]}>
                <MaterialCommunityIcons name="trending-down" size={14} color="#9333ea" />
              </View>
              <Text style={styles.miniStatLabel}>Lowest Month</Text>
              <Text style={styles.miniStatValue}>{formatCurrency(lowestMonth.amount)}</Text>
              <Text style={styles.miniStatSublabel}>{lowestMonth.month}</Text>
            </View>

            <View style={[styles.miniStat, { backgroundColor: CAL_COLORS.bgMarigoldLight }]}>
              <View style={[styles.miniStatIconBox, { backgroundColor: CAL_COLORS.yellowHover }]}>
                <MaterialCommunityIcons name="chart-bar" size={14} color={CAL_COLORS.marigold} />
              </View>
              <Text style={styles.miniStatLabel}>Monthly Average</Text>
              <Text style={styles.miniStatValue}>{formatCurrency(monthlyAverage)}</Text>
              <Text style={styles.miniStatSublabel}>Per Month</Text>
            </View>
          </View>

          <RevenueBarChart data={monthlyRevenue} />
        </SectionCard>

        {/* Next Payout */}
        <SectionCard title="Next Payout">
          <View style={styles.payoutIconRow}>
            <View style={styles.payoutIconBox}>
              <MaterialCommunityIcons name="wallet-outline" size={18} color={CAL_COLORS.primary} />
            </View>
            <Text style={styles.payoutLabel}>Expected Settlement</Text>
          </View>
          <Text style={styles.payoutAmount}>{formatCurrency(nextPayout.amount)}</Text>
          <View style={styles.payoutDateRow}>
            <MaterialCommunityIcons name="calendar-outline" size={14} color={CAL_COLORS.bodyRose} />
            <Text style={styles.payoutDateText}>Scheduled on {nextPayout.scheduledDate}</Text>
          </View>

          <View style={styles.includedPaymentsRow}>
            <Text style={styles.includedPaymentsLabel}>Included Payments</Text>
            <Text style={styles.includedPaymentsValue}>{nextPayout.includedPayments}</Text>
          </View>

          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => setPayoutModalVisible(true)}
          >
            <MaterialCommunityIcons name="open-in-new" size={14} color="#fff" />
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </SectionCard>

        {/* Recent Transactions */}
        <SectionCard title="Recent Transactions" subtitle="Payment history from all bookings">
          {recentTransactions.length === 0 ? (
            <EmptyState icon="receipt-text-outline" message="No transactions available." />
          ) : (
            recentTransactions.map((t) => (
              <View key={t.id} style={styles.transactionRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.transactionName}>{t.customerName}</Text>
                  <Text style={styles.transactionEvent}>{t.eventType} • {t.date}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.transactionTotal}>{formatCurrency(t.total)}</Text>
                  <Text style={styles.transactionStatus}>{t.status}</Text>
                </View>
              </View>
            ))
          )}
        </SectionCard>
      </ScrollView>

      {/* Next Payout Details Modal */}
      <Modal
        visible={payoutModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setPayoutModalVisible(false)}
      >
        <View style={payoutModalStyles.overlay}>
          <Pressable style={payoutModalStyles.backdrop} onPress={() => setPayoutModalVisible(false)} />
          <View style={payoutModalStyles.card}>
            {/* Header */}
            <View style={payoutModalStyles.headerRow}>
              <View>
                <Text style={payoutModalStyles.title}>Upcoming Payout</Text>
                <Text style={payoutModalStyles.subtitle}>
                  Advance payments included in your next settlement.
                </Text>
              </View>
              <TouchableOpacity onPress={() => setPayoutModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={22} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* Top summary cards */}
            <View style={payoutModalStyles.summaryRow}>
              <View style={payoutModalStyles.summaryCard}>
                <View style={payoutModalStyles.summaryIconRow}>
                  <MaterialCommunityIcons name="wallet-outline" size={16} color={CAL_COLORS.primary} />
                  <Text style={payoutModalStyles.summaryLabel}>Total Upcoming Payout</Text>
                </View>
                <Text style={payoutModalStyles.summaryValue}>
                  {formatCurrency(nextPayout.amount)}
                </Text>
              </View>

              <View style={payoutModalStyles.summaryCard}>
                <View style={payoutModalStyles.summaryIconRow}>
                  <MaterialCommunityIcons name="calendar-outline" size={16} color="#16A34A" />
                  <Text style={payoutModalStyles.summaryLabel}>Settlement Date</Text>
                </View>
                <Text style={payoutModalStyles.summaryValueDark}>
                  {nextPayout.scheduledDate}
                </Text>
              </View>
            </View>

            {/* Table */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <View style={payoutModalStyles.tableHeaderRow}>
                  <Text style={[payoutModalStyles.th, { width: 140 }]}>Booking</Text>
                  <Text style={[payoutModalStyles.th, { width: 110 }]}>Customer</Text>
                  <Text style={[payoutModalStyles.th, { width: 100 }]}>Event Date</Text>
                  <Text style={[payoutModalStyles.th, { width: 90 }]}>Advance</Text>
                  <Text style={[payoutModalStyles.th, { width: 90 }]}>Remaining</Text>
                  <Text style={[payoutModalStyles.th, { width: 80 }]}>Status</Text>
                </View>

                <ScrollView style={{ maxHeight: 240 }}>
                  {(nextPayout.bookings ?? []).map((b) => (
                    <View key={b.id} style={payoutModalStyles.tableRow}>
                      <Text style={[payoutModalStyles.td, payoutModalStyles.tdBold, { width: 140 }]}>{b.id}</Text>
                      <Text style={[payoutModalStyles.td, { width: 110 }]}>{b.customerName}</Text>
                      <Text style={[payoutModalStyles.td, { width: 100 }]}>{b.eventDate}</Text>
                      <Text style={[payoutModalStyles.td, payoutModalStyles.tdBold, { width: 90 }]}>
                        {formatCurrency(b.advance)}
                      </Text>
                      <Text style={[payoutModalStyles.td, { width: 90 }]}>{formatCurrency(b.remaining)}</Text>
                      <View style={{ width: 80 }}>
                        <View style={payoutModalStyles.statusPill}>
                          <Text style={payoutModalStyles.statusPillText}>{b.status}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={payoutModalStyles.footerRow}>
              <View>
                <Text style={payoutModalStyles.footerLabel}>Total Settlement</Text>
                <Text style={payoutModalStyles.footerValue}>{formatCurrency(nextPayout.amount)}</Text>
              </View>
              <TouchableOpacity
                style={payoutModalStyles.closeButton}
                onPress={() => setPayoutModalVisible(false)}
              >
                <Text style={payoutModalStyles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Add these to a new file (e.g. payoutModalStyles.ts) or inline via StyleSheet.create
