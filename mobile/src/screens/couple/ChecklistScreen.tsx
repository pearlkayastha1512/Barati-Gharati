import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, IconButton, Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useChecklistStore, ChecklistItem } from "../../store/checklistStore";
import { AddPlannerTaskModal } from "../../components/users/checklist/AddPlannerTaskModal";
import { ChecklistStatCard } from "../../components/users/checklist/ChecklistStatCard";
import { BudgetPreviewCard } from "../../components/users/checklist/BudgetPreviewCard";
import { VendorsPreviewCard } from "../../components/users/checklist/VendorsPreviewCard";
import { styles } from "./styles/ChecklistScreen.styles";

const PRIORITY_COLORS: Record<ChecklistItem["priority"], { bg: string; text: string }> = {
  High: { bg: "#FDECEC", text: "#E53935" },
  Medium: { bg: "#FEF6E0", text: "#D9A404" },
  Low: { bg: "#E8F8F0", text: "#22B07D" },
};

function TaskCard({
  item,
  onToggle,
  onDelete,
}: {
  item: ChecklistItem;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const priorityStyle = PRIORITY_COLORS[item.priority];
  return (
    <View style={[styles.taskCard, item.isDone && styles.taskCardDone]}>
      <Checkbox status={item.isDone ? "checked" : "unchecked"} onPress={onToggle} color="#C2185B" />
      <View style={{ flex: 1 }}>
        <Text style={[styles.taskText, item.isDone && styles.taskTextDone]}>{item.task}</Text>
        {item.description ? <Text style={styles.taskDescription}>{item.description}</Text> : null}
        <View style={styles.taskMetaRow}>
          <View style={[styles.priorityPill, { backgroundColor: priorityStyle.bg }]}>
            <Text style={[styles.priorityPillText, { color: priorityStyle.text }]}>{item.priority}</Text>
          </View>
          {item.dueDate ? (
            <View style={styles.dueDateRow}>
              <MaterialIcons name="event" size={12} color="#999" />
              <Text style={styles.dueDateText}>{item.dueDate}</Text>
            </View>
          ) : null}
        </View>
      </View>
      <IconButton icon="trash-can-outline" size={18} iconColor="#bbb" onPress={onDelete} />
    </View>
  );
}

export default function ChecklistScreen() {
  const navigation = useNavigation<any>();
  const { items, isLoading, fetchChecklist, addItem, toggleItem, removeItem } = useChecklistStore();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchChecklist();
  }, []);

  const pendingTasks = items.filter((item) => !item.isDone);
  const completedTasks = items.filter((item) => item.isDone);
  const percent = items.length > 0 ? Math.round((completedTasks.length / items.length) * 100) : 0;

  const upcomingTasks = pendingTasks
    .filter((item) => item.dueDate)
    .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1));

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={["#EC407A", "#C2185B"]} style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <MaterialIcons name="auto-awesome" size={14} color="#fff" />
            <Text style={styles.heroBadgeText}>Wedding Planner</Text>
          </View>

          <Text style={styles.heroTitle}>Plan your dream{"\n"}wedding.</Text>
          <Text style={styles.heroSubtitle}>
            Organize vendors, manage tasks, track your wedding preparation and never miss an important milestone.
          </Text>

          <TouchableOpacity style={styles.addTaskButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addTaskButtonText}>+ Add Planner Task</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.statsGrid}>
          <ChecklistStatCard icon="checklist" label="Total Tasks" value={items.length} sublabel="Wedding checklist" />
          <ChecklistStatCard icon="check-circle" label="Completed" value={completedTasks.length} sublabel="Finished tasks" />
          <ChecklistStatCard icon="schedule" label="Pending" value={pendingTasks.length} sublabel="Still remaining" />
          <ChecklistStatCard icon="track-changes" label="Progress" value={`${percent}%`} sublabel="Overall completion" />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTopRow}>
            <View>
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
                <TaskCard key={item.id} item={item} onToggle={() => toggleItem(item.id)} onDelete={() => removeItem(item.id)} />
              ))}
              {completedTasks.map((item) => (
                <TaskCard key={item.id} item={item} onToggle={() => toggleItem(item.id)} onDelete={() => removeItem(item.id)} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Planning Timeline</Text>
          <Text style={styles.sectionSubtitle}>Upcoming planner milestones.</Text>

          {upcomingTasks.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyBoxText}>No planner tasks available.</Text>
            </View>
          ) : (
            <View style={{ marginTop: 12 }}>
              {upcomingTasks.map((item) => (
                <View key={item.id} style={styles.timelineRow}>
                  <View style={styles.timelineDot} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.timelineTask}>{item.task}</Text>
                    <Text style={styles.timelineDate}>{item.dueDate}</Text>
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
        onClose={() => setModalVisible(false)}
        onSubmit={(data) => addItem(data)}
      />
    </SafeAreaView>
  );
}