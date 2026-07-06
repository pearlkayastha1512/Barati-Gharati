import { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  Text,
  TextInput,
  IconButton,
  Checkbox,
  Divider,
} from "react-native-paper";

// TODO: import API functions once backend is connected
// import { getChecklist, createChecklistItem, toggleChecklistItem, deleteChecklistItem } from "../../api/checklist.api";

type ChecklistItem = {
  id: string;
  task: string;
  isDone: boolean;
};

// Some sample tasks so the screen isn't empty when you preview it
const initialItems: ChecklistItem[] = [
  { id: "1", task: "Book the venue", isDone: true },
  { id: "2", task: "Send invitations", isDone: false },
  { id: "3", task: "Finalize the guest list", isDone: false },
  { id: "4", task: "Book photographer", isDone: true },
];

export default function ChecklistScreen() {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [newTask, setNewTask] = useState("");

  // TODO: fetch checklist from backend on mount
  // useEffect(() => {
  //   const fetchItems = async () => {
  //     try {
  //       const response = await getChecklist();
  //       setItems(response.data);
  //     } catch (error) {
  //       console.log("Failed to load checklist:", error);
  //     }
  //   };
  //   fetchItems();
  // }, []);

  const handleAdd = () => {
    if (!newTask.trim()) return;

    // TODO: replace local add with API call
    // const response = await createChecklistItem(newTask.trim());
    // setItems((prev) => [response.data, ...prev]);

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      task: newTask.trim(),
      isDone: false,
    };

    setItems((prev) => [newItem, ...prev]);
    setNewTask("");
  };

  const handleToggle = (id: string) => {
    // TODO: replace local toggle with API call
    // await toggleChecklistItem(id, !item.isDone);

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isDone: !item.isDone } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    // TODO: replace local delete with API call
    // await deleteChecklistItem(id);

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const doneCount = items.filter((item) => item.isDone).length;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Wedding Checklist ✅
      </Text>

      <Text variant="bodyMedium" style={styles.subtitle}>
        {doneCount} of {items.length} tasks done
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          mode="outlined"
          placeholder="Add a task..."
          value={newTask}
          onChangeText={setNewTask}
          style={styles.input}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <IconButton
          icon="plus-circle"
          size={32}
          iconColor="#C2185B"
          onPress={handleAdd}
          disabled={!newTask.trim()}
        />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No tasks yet. Add your first one above!
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Checkbox
              status={item.isDone ? "checked" : "unchecked"}
              onPress={() => handleToggle(item.id)}
              color="#C2185B"
            />
            <Text
              style={[
                styles.taskText,
                item.isDone && styles.taskDone,
              ]}
            >
              {item.task}
            </Text>
            <IconButton
              icon="trash-can-outline"
              size={20}
              iconColor="#999"
              onPress={() => handleDelete(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF8F8",
  },
  title: {
    color: "#C2185B",
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    color: "#666",
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  taskDone: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  empty: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
  },
});