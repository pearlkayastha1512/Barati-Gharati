import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Platform } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Priority } from "../../../store/checklistStore";
import { styles } from "../../../screens/couple/styles/ChecklistScreen.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { task: string; description?: string; priority: Priority; dueDate?: string }) => void;
};

const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

function formatDate(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function AddPlannerTaskModal({ visible, onClose, onSubmit }: Props) {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!task.trim()) return;
    onSubmit({
      task: task.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate ? formatDate(dueDate) : undefined,
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
            <Text style={styles.modalTitle}>Add Planner Task</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          <TextInput
            mode="outlined"
            placeholder="Task title"
            value={task}
            onChangeText={setTask}
            style={styles.modalInput}
          />

          <TextInput
            mode="outlined"
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={[styles.modalInput, styles.modalTextArea]}
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
                placeholder="dd-mm-yyyy"
                value={dueDate ? formatDate(dueDate) : ""}
                style={styles.modalInput}
                right={<TextInput.Icon icon="calendar" />}
                editable={false}
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
            <Button mode="outlined" onPress={onClose} style={styles.modalCancelButton}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.modalAddButton}
              disabled={!task.trim()}
            >
              Add Task
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}