import React, { useState, useMemo, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar } from "react-native-calendars";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { CAL_COLORS } from "../../constants/calendarTheme";
import { useVendorCalendarStore } from "../../store/vendorCalendarStore";
import { StatCard } from "../../components/vendors/dashboard/StatCard";
import { SectionCard } from "../../components/vendors/dashboard/SectionCard";
import { EmptyState } from "../../components/vendors/dashboard/EmptyState";
import { BlockDateModal } from "../../components/vendors/calendar/BlockDateModal";
import { styles } from "./vendorCalendarStyles";

export default function VendorCalendarScreen() {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    selectedDate,
    setSelectedDate,
    blockedDates,
    bookedDates,
    upcomingEvents,
    isBlocked,
    getMonthStats,
  } = useVendorCalendarStore();

  useEffect(() => {
    useVendorCalendarStore.getState().fetchCalendarData();
  }, []);

  const today = new Date();
  const stats = useMemo(
    () => getMonthStats(today.getFullYear(), today.getMonth()),
    [blockedDates, bookedDates]
  );

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    blockedDates.forEach((b) => {
      marks[b.date] = {
        customStyles: {
          container: { backgroundColor: CAL_COLORS.yellowHover, borderRadius: 8 },
          text: { color: CAL_COLORS.blocked, fontWeight: "700" },
        },
      };
    });

    bookedDates.forEach((b) => {
      marks[b.date] = {
        customStyles: {
          container: { backgroundColor: CAL_COLORS.pinkIconBg, borderRadius: 8 },
          text: { color: CAL_COLORS.primary, fontWeight: "700" },
        },
      };
    });

    marks[selectedDate] = {
      customStyles: {
        container: { backgroundColor: CAL_COLORS.primary, borderRadius: 8 },
        text: { color: "#fff", fontWeight: "700" },
      },
    };

    return marks;
  }, [blockedDates, bookedDates, selectedDate]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero header */}
        <LinearGradient
          colors={[CAL_COLORS.primary, CAL_COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.heroPill}>
            <MaterialCommunityIcons name="calendar-month-outline" size={13} color="#fff" />
            <Text style={styles.heroPillText}>Event Calendar</Text>
          </View>
          <Text style={styles.heroTitle}>Organize your{"\n"}wedding schedule.</Text>
          <Text style={styles.heroSubtitle}>
            Track bookings, block dates and manage your availability.
          </Text>
        </LinearGradient>

        {/* Stat Cards */}
        <View style={styles.grid}>
          <StatCard icon="calendar-check-outline" label="Events" value={`${bookedDates.length}`} sublabel="This Month" />
          <StatCard icon="clock-outline" label="Today" value="0" sublabel="Events Today" />
          <StatCard icon="cancel" label="Blocked" value={`${stats.blockedDays}`} sublabel="This Month" />
          <StatCard icon="check-circle-outline" label="Available" value={`${stats.availableDays}`} sublabel="This Month" />
        </View>

        {/* Calendar — collapsible */}
        <View style={styles.sectionCardWrap}>
          <TouchableOpacity
            style={styles.calendarHeaderRow}
            onPress={() => setCalendarOpen((prev) => !prev)}
            activeOpacity={0.7}
          >
            <View style={styles.calendarHeaderLeft}>
              <View style={styles.calendarIconBox}>
                <MaterialCommunityIcons name="calendar-month" size={18} color={CAL_COLORS.primary} />
              </View>
              <View>
                <Text style={styles.calendarHeaderTitle}>Vendor Calendar</Text>
                <Text style={styles.calendarHeaderSubtitle}>
                  {calendarOpen ? "Tap to collapse" : `Selected: ${selectedDate}`}
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name={calendarOpen ? "chevron-up" : "chevron-down"}
              size={24}
              color={CAL_COLORS.primary}
            />
          </TouchableOpacity>

          {calendarOpen && (
            <View style={styles.calendarBody}>
              <Calendar
                current={selectedDate}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markingType="custom"
                markedDates={markedDates}
                theme={{
                  todayTextColor: CAL_COLORS.primary,
                  arrowColor: CAL_COLORS.primary,
                  selectedDayBackgroundColor: CAL_COLORS.primary,
                  selectedDayTextColor: "#fff",
                  textDayFontWeight: "500",
                  textMonthFontWeight: "700",
                  monthTextColor: CAL_COLORS.headingPlum,
                }}
                style={styles.calendarInner}
              />

              <View style={styles.selectedDateBox}>
                <Text style={styles.selectedDateLabel}>Selected Date</Text>
                <Text style={styles.selectedDateValue}>{selectedDate}</Text>
                {isBlocked(selectedDate) && (
                  <View style={styles.blockedTag}>
                    <Text style={styles.blockedTagText}>Blocked</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Availability panel */}
        <SectionCard title="Availability" subtitle="Current month availability">
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Available</Text>
            <Text style={styles.progressValue}>{stats.availablePercent}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${stats.availablePercent}%` }]} />
          </View>

          <View style={styles.availabilityRow}>
            <MaterialCommunityIcons name="check-circle-outline" size={16} color={CAL_COLORS.available} />
            <Text style={styles.availabilityLabel}>Available Days</Text>
            <Text style={styles.availabilityValue}>{stats.availableDays}</Text>
          </View>
          <View style={styles.availabilityRow}>
            <MaterialCommunityIcons name="calendar-check" size={16} color={CAL_COLORS.primary} />
            <Text style={styles.availabilityLabel}>Booked Days</Text>
            <Text style={styles.availabilityValue}>{stats.bookedDays}</Text>
          </View>
          <View style={styles.availabilityRow}>
            <MaterialCommunityIcons name="cancel" size={16} color={CAL_COLORS.blocked} />
            <Text style={styles.availabilityLabel}>Blocked Days</Text>
            <Text style={styles.availabilityValue}>{stats.blockedDays}</Text>
          </View>

          <TouchableOpacity style={styles.manageButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.manageButtonText}>Manage Availability</Text>
          </TouchableOpacity>
        </SectionCard>

        {/* Upcoming Events */}
        <SectionCard title="Upcoming Events">
          {upcomingEvents.length === 0 ? (
            <EmptyState icon="calendar-blank-outline" message="No Upcoming Events. Upcoming accepted bookings will appear here." />
          ) : (
            upcomingEvents.map((e) => (
              <View key={e.bookingId} style={styles.upcomingRow}>
                <Text style={styles.upcomingName}>{e.customerName}</Text>
                <Text style={styles.upcomingDate}>{e.date}</Text>
              </View>
            ))
          )}
        </SectionCard>
      </ScrollView>

      <BlockDateModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}