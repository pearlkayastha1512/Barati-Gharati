import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Pressable, ScrollView, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { EXPENSE_CATEGORIES } from "../../../store/budgetStore";
import { styles } from "../../../screens/couple/styles/BudgetScreen.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; category: string; amount: number; date: string; note?: string }) => void;
};

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function AddExpenseModal({ visible, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const reset = () => {
    setTitle("");
    setCategory(EXPENSE_CATEGORIES[0]);
    setAmount("");
    setNote("");
    setDate(new Date());
  };

  const handleSubmit = () => {
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || !parsedAmount || parsedAmount <= 0) return;

    onSubmit({
      title: title.trim(),
      category,
      amount: parsedAmount,
      date: date.toISOString(),
      note: note.trim() || undefined,
    });
    reset();
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // On Android, the picker closes itself after a selection or dismissal.
    // On iOS, it stays open inline, so we don't auto-close there.
    if (Platform.OS === "android") {
      setDatePickerOpen(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.addExpenseSheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.addExpenseHeader}>
            <Text style={styles.addExpenseTitle}>Add Expense</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color="#3F1D2F" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.fieldLabel}>Expense Title</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="Invitation Cards"
              placeholderTextColor="#B8919F"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.fieldLabel}>Category</Text>
            <TouchableOpacity style={styles.fieldInput} onPress={() => setCategoryPickerOpen((v) => !v)}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: "#3F1D2F" }}>{category}</Text>
                <MaterialIcons name={categoryPickerOpen ? "arrow-drop-up" : "arrow-drop-down"} size={20} color="#8D6171" />
              </View>
            </TouchableOpacity>
            {categoryPickerOpen && (
              <View style={styles.categoryDropdown}>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.categoryDropdownItem}
                    onPress={() => {
                      setCategory(cat);
                      setCategoryPickerOpen(false);
                    }}
                  >
                    <Text style={{ color: cat === category ? "#FF4D6D" : "#3F1D2F" }}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.fieldLabel}>Amount</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="0"
              placeholderTextColor="#B8919F"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.fieldLabel}>Expense Date</Text>
            <TouchableOpacity style={styles.fieldInput} onPress={() => setDatePickerOpen(true)}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: "#3F1D2F" }}>{formatDate(date)}</Text>
                <MaterialIcons name="calendar-today" size={18} color="#FF4D6D" />
              </View>
            </TouchableOpacity>
            {datePickerOpen && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={handleDateChange}
                maximumDate={new Date()} // TODO: relax this if future-dated expenses (e.g. pre-booked deposits) should be allowed
              />
            )}

            <Text style={styles.fieldLabel}>Notes (optional)</Text>
            <TextInput
              style={[styles.fieldInput, { height: 80, textAlignVertical: "top" }]}
              placeholder="Enter any additional notes..."
              placeholderTextColor="#B8919F"
              multiline
              value={note}
              onChangeText={setNote}
            />
          </ScrollView>

          <View style={styles.addExpenseFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
