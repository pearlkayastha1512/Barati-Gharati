import React from "react";
import { View } from "react-native";
import { Card } from "react-native-paper";

type Props = {
  children: React.ReactNode;
};

export default function RegistrationCard({
  children,
}: Props) {
  return (
    <Card
      style={{
        borderRadius: 18,
        backgroundColor: "#fff",
        elevation: 3,
        marginBottom: 20,
      }}
    >
      <Card.Content>{children}</Card.Content>
    </Card>
  );
}