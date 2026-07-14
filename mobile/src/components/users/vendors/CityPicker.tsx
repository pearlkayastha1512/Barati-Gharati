import React, { useState } from "react";
import { TouchableOpacity, Text, Modal, View, FlatList, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CITIES } from "../../../constants/vendorData";
import { styles } from "./VendorList.styles";

type Props = {
  selectedCity: string;
  onSelect: (city: string) => void;
};

export function CityPicker({ selectedCity, onSelect }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.cityPill} onPress={() => setVisible(true)}>
        <MaterialIcons name="location-on" size={16} color="#FF4D6D" />
        <Text style={styles.cityPillText}>{selectedCity}</Text>
        <MaterialIcons name="arrow-drop-down" size={20} color="#8D6171" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select City</Text>
            <FlatList
              data={CITIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      item === selectedCity && styles.modalItemTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {item === selectedCity && (
                    <MaterialIcons name="check" size={18} color="#FF4D6D" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
