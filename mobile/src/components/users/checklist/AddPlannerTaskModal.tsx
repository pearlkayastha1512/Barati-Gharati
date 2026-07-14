import React, { useEffect, useState } from "react";
import { View, Modal, TouchableOpacity, Platform } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import type { ChecklistItem, Priority } from "../../../store/checklistStore";
import { styles } from "../../../screens/couple/styles/ChecklistScreen.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { task: string; description?: string; priority: Priority; dueDate: string }) => void | Promise<void>;
  initialItem?: ChecklistItem | null;
};

const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

function formatDate(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function parseDisplayDate(value?: string) {
  if (!value) return null;
  const [dd, mm, yyyy] = value.split("-").map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function AddPlannerTaskModal({ visible, onClose, onSubmit, initialItem }: Props) {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setTask(initialItem?.task ?? "");
    setDescription(initialItem?.description ?? "");
    setPriority(initialItem?.priority ?? "Medium");
    setDueDate(parseDisplayDate(initialItem?.dueDate));
    setShowDatePicker(false);
  }, [initialItem, visible]);

  const handleSubmit = async () => {
    if (!task.trim() || !dueDate) return;
    await onSubmit({
      task: task.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: formatDate(dueDate),
    });
    setTask("");
    setDescription("");
    setPriority("Medium");
    setDueDate(null);
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios"); // iOS keeps picker open inline, Android closes it
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <View style={styles.modalTitleIcon}>
                <MaterialIcons name={initialItem ? "edit-calendar" : "event-note"} size={20} color="#ff4d6d" />
              </View>
              <View style={styles.modalTitleCopy}>
                <Text style={styles.modalTitle}>{initialItem ? "Edit Planner Task" : "Add Planner Task"}</Text>
                <Text style={styles.modalSubtitle}>Keep your wedding plan on schedule.</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          <TextInput
            mode="outlined"
            label="Task title"
            value={task}
            onChangeText={setTask}
            style={styles.modalInput}
            outlineColor="#ffb3bf"
            activeOutlineColor="#ff4d6d"
          />

          <TextInput
            mode="outlined"
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={[styles.modalInput, styles.modalTextArea]}
            outlineColor="#ffb3bf"
            activeOutlineColor="#ff4d6d"
          />

          <View style={styles.modalRow}>
            <View style={styles.priorityPicker}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.priorityChip, priority === p && styles.priorityChipActive]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.priorityChipText, priority === p && styles.priorityChipTextActive]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View pointerEvents="none">
              <TextInput
                mode="outlined"
                label="Due date"
                placeholder="dd-mm-yyyy"
                value={dueDate ? formatDate(dueDate) : ""}
                style={styles.modalInput}
                right={<TextInput.Icon icon="calendar" />}
                editable={false}
                outlineColor="#ffb3bf"
                activeOutlineColor="#ff4d6d"
              />
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate ?? new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          <View style={styles.modalButtonRow}>
            <Button mode="outlined" onPress={onClose} style={styles.modalCancelButton} textColor="#7a4a5c">
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.modalAddButton}
              buttonColor="#ff4d6d"
              disabled={!task.trim() || !dueDate}
            >
              {initialItem ? "Save Changes" : "Add Task"}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
