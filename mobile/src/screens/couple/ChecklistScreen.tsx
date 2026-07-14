import React, { useCallback, useState } from "react";
import { RefreshControl, View, ScrollView, TouchableOpacity } from "react-native";
import { Text, IconButton, Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useChecklistStore } from "../../store/checklistStore";
import type { ChecklistItem } from "../../store/checklistStore";
import { useBookingStore } from "../../store/bookingStore";
import { useBudgetStore } from "../../store/budgetStore";
import { useAuthStore } from "../../store/authStore";
import { AddPlannerTaskModal } from "../../components/users/checklist/AddPlannerTaskModal";
import { ChecklistStatCard } from "../../components/users/checklist/ChecklistStatCard";
import { BudgetPreviewCard } from "../../components/users/checklist/BudgetPreviewCard";
import { VendorsPreviewCard } from "../../components/users/checklist/VendorsPreviewCard";
import { styles } from "./styles/ChecklistScreen.styles";

const PRIORITY_COLORS: Record<ChecklistItem["priority"], { bg: string; text: string }> = {
  High: { bg: "#ffe6eb", text: "#e63b5f" },
  Medium: { bg: "#fff3b0", text: "#6c2d45" },
  Low: { bg: "#fff8d8", text: "#7a4a5c" },
};

function TaskCard({
  item,
  onToggle,
  onDelete,
  onEdit,
}: {
  item: ChecklistItem;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const priorityStyle = PRIORITY_COLORS[item.priority];
  return (
    <View style={[styles.taskCard, item.isDone && styles.taskCardDone]}>
      <Checkbox status={item.isDone ? "checked" : "unchecked"} onPress={onToggle} color="#ff4d6d" uncheckedColor="#ffb3bf" />
      <View style={styles.taskCopy}>
        <Text style={[styles.taskText, item.isDone && styles.taskTextDone]}>{item.task}</Text>
        {item.description ? <Text style={styles.taskDescription}>{item.description}</Text> : null}
        <View style={styles.taskMetaRow}>
          <View style={[styles.priorityPill, { backgroundColor: priorityStyle.bg }]}>
            <Text style={[styles.priorityPillText, { color: priorityStyle.text }]}>{item.priority}</Text>
          </View>
          {item.dueDate ? (
            <View style={styles.dueDateRow}>
              <MaterialIcons name="event" size={12} color="#8d6171" />
              <Text style={styles.dueDateText}>{item.dueDate}</Text>
            </View>
          ) : null}
        </View>
      </View>
      <View style={styles.taskActions}>
        <IconButton icon="pencil-outline" size={17} iconColor="#7a4a5c" onPress={onEdit} style={styles.taskActionButton} />
        <IconButton icon="trash-can-outline" size={17} iconColor="#e63b5f" onPress={onDelete} style={styles.taskDeleteButton} />
      </View>
    </View>
  );
}

export default function ChecklistScreen() {
  const { items, isLoading, fetchChecklist, addItem, updateItem, toggleItem, removeItem } = useChecklistStore();
  const bookings = useBookingStore((state) => state.bookings);
  const loadBookings = useBookingStore((state) => state.loadBookings);
  const loadBudget = useBudgetStore((state) => state.loadBudget);
  const user = useAuthStore((state) => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadPlannerData = useCallback(async () => {
    await Promise.all([fetchChecklist(), loadBookings(), loadBudget()]);
  }, [fetchChecklist, loadBookings, loadBudget]);

  useFocusEffect(
    useCallback(() => {
      void loadPlannerData();
    }, [loadPlannerData]),
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPlannerData();
    setIsRefreshing(false);
  };

  const pendingTasks = items.filter((item) => !item.isDone);
  const completedTasks = items.filter((item) => item.isDone);
  const percent = items.length > 0 ? Math.round((completedTasks.length / items.length) * 100) : 0;

  const dateValue = (value?: string) => {
    if (!value) return Number.MAX_SAFE_INTEGER;
    const [day, month, year] = value.split("-").map(Number);
    return new Date(year, month - 1, day).getTime();
  };
  const timelineTasks = [...items].sort((first, second) =>
    dateValue(first.dueDate) - dateValue(second.dueDate)
  );
  const today = new Date().setHours(0, 0, 0, 0);
  const nextBooking = bookings
    .filter((booking) =>
      !["cancelled", "rejected"].includes(booking.bookingStatus) &&
      new Date(booking.eventDate).getTime() >= today
    )
    .sort((first, second) =>
      new Date(first.eventDate).getTime() - new Date(second.eventDate).getTime()
    )[0];
  const daysRemaining = nextBooking
    ? Math.max(0, Math.ceil((new Date(nextBooking.eventDate).getTime() - Date.now()) / 86400000))
    : null;
  const firstName = user?.name?.split(" ")[0] || "Customer";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={(
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={["#ff4d6d"]} tintColor="#ff4d6d" />
        )}
      >
        <LinearGradient
          colors={["#ff4d6d", "#ff8fa1", "#fff3b0"]}
          locations={[0, 0.58, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View pointerEvents="none" style={styles.heroDecorations}>
            <View style={styles.heroRingOne} />
            <View style={styles.heroRingTwo} />
            <MaterialIcons name="auto-awesome" size={78} color="rgba(255,255,255,0.10)" style={styles.heroSparkle} />
          </View>
          <View style={styles.heroBadge}>
            <MaterialIcons name="auto-awesome" size={14} color="#fff" />
            <Text style={styles.heroBadgeText}>Wedding Planner</Text>
          </View>

          <Text style={styles.heroTitle}>{firstName},{"\n"}plan your dream wedding.</Text>
          <Text style={styles.heroSubtitle}>
            Organize vendors, manage tasks, track your wedding preparation and never miss an important milestone.
          </Text>

          <TouchableOpacity
            style={styles.addTaskButton}
            onPress={() => {
              setSelectedItem(null);
              setModalVisible(true);
            }}
          >
            <Text style={styles.addTaskButtonText}>+ Add Planner Task</Text>
          </TouchableOpacity>

          <View style={styles.heroSummaryCard}>
            <View style={styles.heroSummaryHeader}>
              <MaterialIcons name="event-available" size={19} color="#ff4d6d" />
              <Text style={styles.heroSummaryTitle}>Wedding Summary</Text>
            </View>
            <View style={styles.heroSummaryGrid}>
              <View style={styles.heroSummaryItem}>
                <Text style={styles.heroSummaryLabel}>Next Event</Text>
                <Text style={styles.heroSummaryValue} numberOfLines={1}>
                  {nextBooking
                    ? new Date(nextBooking.eventDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                    : "Not scheduled"}
                </Text>
              </View>
              <View style={styles.heroSummaryItem}>
                <Text style={styles.heroSummaryLabel}>Days Remaining</Text>
                <Text style={styles.heroSummaryValue}>{daysRemaining === null ? "--" : `${daysRemaining} days`}</Text>
              </View>
              <View style={styles.heroSummaryItem}>
                <Text style={styles.heroSummaryLabel}>Tasks Completed</Text>
                <Text style={styles.heroSummaryValue}>{completedTasks.length} / {items.length}</Text>
              </View>
              <View style={styles.heroSummaryItem}>
                <Text style={styles.heroSummaryLabel}>Planning Progress</Text>
                <Text style={styles.heroSummaryValue}>{percent}%</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.statsGrid}>
          <ChecklistStatCard icon="checklist" label="Total Tasks" value={items.length} sublabel="Wedding checklist" />
          <ChecklistStatCard icon="check-circle" label="Completed" value={completedTasks.length} sublabel="Finished tasks" />
          <ChecklistStatCard icon="schedule" label="Pending" value={pendingTasks.length} sublabel="Still remaining" />
          <ChecklistStatCard icon="track-changes" label="Progress" value={`${percent}%`} sublabel="Overall completion" />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTopRow}>
            <View style={styles.sectionHeadingCopy}>
              <Text style={styles.sectionTitle}>Wedding Checklist</Text>
              <Text style={styles.sectionSubtitle}>Stay on top of every important task.</Text>
            </View>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{completedTasks.length} / {items.length} Completed</Text>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyBoxText}>Loading...</Text>
            </View>
          ) : items.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyBoxText}>No planner tasks yet.</Text>
            </View>
          ) : (
            <View style={{ marginTop: 12 }}>
              {pendingTasks.map((item) => (
                <TaskCard
                  key={item.id}
                  item={item}
                  onToggle={() => void toggleItem(item.id)}
                  onDelete={() => void removeItem(item.id)}
                  onEdit={() => {
                    setSelectedItem(item);
                    setModalVisible(true);
                  }}
                />
              ))}
              {completedTasks.map((item) => (
                <TaskCard
                  key={item.id}
                  item={item}
                  onToggle={() => void toggleItem(item.id)}
                  onDelete={() => void removeItem(item.id)}
                  onEdit={() => {
                    setSelectedItem(item);
                    setModalVisible(true);
                  }}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Planning Timeline</Text>
          <Text style={styles.sectionSubtitle}>Upcoming planner milestones.</Text>

          {timelineTasks.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyBoxText}>No planner tasks available.</Text>
            </View>
          ) : (
            <View style={{ marginTop: 12 }}>
              {timelineTasks.map((item, index) => (
                <View key={item.id} style={styles.timelineRow}>
                  <View style={styles.timelineRail}>
                    <View style={[styles.timelineDot, item.isDone && styles.timelineDotDone]}>
                      <MaterialIcons name={item.isDone ? "check" : "event"} size={14} color={item.isDone ? "#fff" : "#ff4d6d"} />
                    </View>
                    {index < timelineTasks.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTask}>{item.task}</Text>
                    {item.description ? <Text style={styles.timelineDescription}>{item.description}</Text> : null}
                    <Text style={styles.timelineDate}>{item.dueDate}</Text>
                    <View style={[styles.timelineStatus, item.isDone && styles.timelineStatusDone]}>
                      <Text style={[styles.timelineStatusText, item.isDone && styles.timelineStatusTextDone]}>
                        {item.isDone ? "Completed" : "Pending"}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.previewRow}>
          <BudgetPreviewCard />
          <VendorsPreviewCard />
        </View>
      </ScrollView>

      <AddPlannerTaskModal
        visible={modalVisible}
        initialItem={selectedItem}
        onClose={() => {
          setModalVisible(false);
          setSelectedItem(null);
        }}
        onSubmit={(data) =>
          selectedItem ? updateItem(selectedItem.id, data) : addItem(data)
        }
      />
    </SafeAreaView>
  );
}
