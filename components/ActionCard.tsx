import React, { ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ActionCardProps {
  title: string;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  children?: ReactNode;
}

export default function ActionCard({ title, onPress, onEdit, onDelete, children }: ActionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={onEdit}>
            <Ionicons name="pencil" size={20} color="#000000ff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash" size={20} color="#000000ff" />
          </TouchableOpacity>
        </View>
      </View>

      {children}

      <TouchableOpacity style={styles.selectButton} onPress={onPress}>
        <Text style={styles.selectButtonText}>Acessar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    flex: 1,
  },
  cardActions: {
    flexDirection: "row",
    gap: 16,
    marginLeft: 16,
  },
  selectButton: {
    backgroundColor: "#eff6ff",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
  },
  selectButtonText: {
    color: "#1d4ed8",
    fontWeight: "600",
  },
});
