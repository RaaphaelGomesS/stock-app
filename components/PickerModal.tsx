import React from "react";
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

interface PickerModalProps {
  visible: boolean;
  items: { label: string; value: string | number }[];
  onSelect: (value: any) => void;
  onClose: () => void;
  title: string;
  isLoading?: boolean;
}

export default function PickerModal({ visible, items, onSelect, onClose, title, isLoading = false }: PickerModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#2563eb" style={{ paddingVertical: 20 }} />
          ) : items.length === 0 ? (
            <Text style={styles.modalEmptyText}>Nenhuma opção disponível.</Text>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => onSelect(item.value)}>
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { backgroundColor: "white", padding: 24, borderRadius: 12, width: "80%", maxHeight: "60%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  modalItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  modalItemText: { textAlign: "center", fontSize: 16 },
  modalEmptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#64748b",
    paddingVertical: 20,
  },
});
