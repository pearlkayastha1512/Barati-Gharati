import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/vendor/VendorRegistration/styles";

type Props = {
  onPrevious?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showPrevious?: boolean;
};

export function NavigationButtons({
  onPrevious,
  onNext,
  nextLabel = "Continue",
  nextDisabled,
  showPrevious = true,
}: Props) {
  return (
    <View style={styles.navRow}>
      {showPrevious ? (
        <TouchableOpacity style={styles.prevButton} onPress={onPrevious}>
          <MaterialIcons name="arrow-back" size={16} color="#333" />
          <Text style={styles.prevButtonText}>Previous</Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}
      <TouchableOpacity
        style={[styles.nextButton, nextDisabled && styles.nextButtonDisabled]}
        onPress={onNext}
        disabled={nextDisabled}
      >
        <Text style={styles.nextButtonText}>{nextLabel}</Text>
        <MaterialIcons name="arrow-forward" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}