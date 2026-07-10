import React, { Fragment } from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../screens/vendor/VendorRegistration/styles";

const STEPS = ["Account", "Business", "Gallery", "Review"];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <View style={styles.stepRow}>
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <Fragment key={label}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  isCompleted && styles.stepCircleCompleted,
                  isActive && styles.stepCircleActive,
                ]}
              >
                {isCompleted ? (
                  <MaterialIcons name="check" size={16} color="#fff" />
                ) : (
                  <Text style={[styles.stepNumberText, isActive && styles.stepNumberTextActive]}>
                    {stepNumber}
                  </Text>
                )}
              </View>
              <Text style={[styles.stepLabel, (isCompleted || isActive) && styles.stepLabelActive]}>
                {label}
              </Text>
            </View>
            {index < STEPS.length - 1 && (
              <View style={[styles.stepLine, isCompleted && styles.stepLineCompleted]} />
            )}
          </Fragment>
        );
      })}
    </View>
  );
}