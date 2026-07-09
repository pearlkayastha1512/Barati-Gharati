import React from "react";
import { ScrollView, View, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerBox } from "../../../components/vendors/vendorRegistration/Imagepicker";
import { useVendorRegistrationStore } from "../../../store/vendorRegistrationStore";
import { SectionTitle } from "../../../components/vendors/vendorRegistration/SectionTitle";
import RegistrationCard from "../../../components/vendors/vendorRegistration/RegistrationCard";
import { NavigationButtons } from "../../../components/vendors/vendorRegistration/NavigationButtons";

import { styles } from "./styles";

export default function GalleryStep() {
  const { gallery, setGallery, nextStep, prevStep } = useVendorRegistrationStore();

  const pickImage = async (type: "profile" | "cover") => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo library access to select an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      if (type === "profile") {
        setGallery({ ...gallery, profileImageUri: uri });
      } else {
        setGallery({ ...gallery, coverImageUri: uri });
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.stepScroll} showsVerticalScrollIndicator={false}>
      <RegistrationCard>
        <SectionTitle title="Gallery" subtitle="Upload images that represent your business." />

        <View style={styles.galleryRow}>
          <ImagePickerBox
            label="Profile Image"
            imageUri={gallery.profileImageUri}
            onPress={() => pickImage("profile")}
          />
          <ImagePickerBox
            label="Cover Image"
            imageUri={gallery.coverImageUri}
            onPress={() => pickImage("cover")}
          />
        </View>

        <NavigationButtons onPrevious={prevStep} onNext={nextStep} />
      </RegistrationCard>
    </ScrollView>
  );
}