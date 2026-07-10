import { ScrollView, Text, View } from "react-native";

const badge = {
  name: "Bronze",
  limit: 5,
  used: 0,
  color: "#92400e",
  bg: "#fef3c7",
};

export default function VendorHomeScreen() {
  const remaining = Math.max(
    badge.limit - badge.used,
    0
  );

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#f8fafc",
      }}
      contentContainerStyle={{
        padding: 20,
        gap: 16,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "800",
          color: "#0f172a",
        }}
      >
        Vendor Dashboard
      </Text>

      <View
        style={{
          borderRadius: 24,
          backgroundColor: "#ffffff",
          padding: 20,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 3,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#64748b",
          }}
        >
          Vendor Badge
        </Text>

        <View
          style={{
            marginTop: 12,
            alignSelf: "flex-start",
            borderRadius: 999,
            backgroundColor: badge.bg,
            paddingHorizontal: 14,
            paddingVertical: 8,
          }}
        >
          <Text
            style={{
              color: badge.color,
              fontWeight: "800",
            }}
          >
            {badge.name} Badge
          </Text>
        </View>

        <Text
          style={{
            marginTop: 18,
            fontSize: 32,
            fontWeight: "900",
            color: "#0f172a",
          }}
        >
          {badge.used}/{badge.limit}
        </Text>

        <Text
          style={{
            marginTop: 4,
            color: "#64748b",
            fontSize: 15,
          }}
        >
          bookings received this month
        </Text>

        <Text
          style={{
            marginTop: 12,
            color: "#16a34a",
            fontWeight: "700",
          }}
        >
          {remaining} bookings left
        </Text>
      </View>
    </ScrollView>
  );
}
