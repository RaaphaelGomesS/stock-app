import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { createShelf, updateShelf, Shelf } from "@/services/ShelfService";
import { useStock } from "@/context/StockContext";
import PickerModal from "@/components/PickerModal";
import { ProductType } from "@/constants/Enums";

export default function ShelfFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { stockId } = useStock();

  const [shelf, setShelf] = useState<Shelf | null>(null);
  const isEditMode = !!shelf;

  const [rows, setRows] = useState("");
  const [columns, setColumns] = useState("");
  const [destination, setDestination] = useState<keyof typeof ProductType>("GENERICO");
  const [restriction, setRestriction] = useState("");
  const [isPickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    if (params.shelf) {
      const existingShelf = JSON.parse(params.shelf as string) as Shelf;
      setShelf(existingShelf);
      setRows(existingShelf.rows.toString());
      setColumns(existingShelf.columns.toString());
      setDestination(existingShelf.destination as keyof typeof ProductType);
      setRestriction(existingShelf.restriction || "");
    }
  }, [params.shelf]);

  const handleSave = async () => {
    if (!rows || !columns || !stockId) {
      Alert.alert("Erro", "Linhas e Colunas são obrigatórias.");
      return;
    }

    const shelfData = {
      stockId: stockId,
      rows: parseInt(rows, 10),
      columns: parseInt(columns, 10),
      destination,
      restriction: restriction || null,
    };

    try {
      if (isEditMode) {
        await updateShelf(shelf!.id, shelfData);
        Alert.alert("Sucesso", "Prateleira atualizada!");
      } else {
        await createShelf(shelfData as any);
        Alert.alert("Sucesso", "Prateleira criada!");
      }
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a prateleira.");
    }
  };

  const typeItems = Object.keys(ProductType).map((key) => ({ label: key, value: key }));

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: isEditMode ? "Editar Prateleira" : "Nova Prateleira" }} />
      <PickerModal
        title="Selecione o Destino"
        visible={isPickerVisible}
        items={typeItems}
        onClose={() => setPickerVisible(false)}
        onSelect={(item) => {
          setDestination(item);
          setPickerVisible(false);
        }}
      />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Estoque</Text>
        <TextInput style={[styles.input, styles.disabledInput]} value={`Estoque ID: ${stockId}`} editable={false} />

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Linhas</Text>
            <TextInput
              style={styles.input}
              value={rows}
              onChangeText={setRows}
              placeholder="Ex: 10"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Colunas</Text>
            <TextInput
              style={styles.input}
              value={columns}
              onChangeText={setColumns}
              placeholder="Ex: 8"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.label}>Tipo de Destino (Opcional)</Text>
        <TouchableOpacity style={styles.inputButton} onPress={() => setPickerVisible(true)}>
          <Text style={styles.inputButtonText}>{destination}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Restrições (Opcional)</Text>
        <TextInput
          style={styles.input}
          value={restriction}
          onChangeText={setRestriction}
          placeholder="Ex: Apenas produtos frágeis"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>{isEditMode ? "Salvar Alterações" : "Salvar Prateleira"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  form: { padding: 24, gap: 20 },
  row: { flexDirection: "row", gap: 16 },
  inputGroup: { flex: 1 },
  label: { fontSize: 14, fontWeight: "500", color: "#334155", marginBottom: 8 },
  input: {
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 16,
    fontSize: 16,
  },
  disabledInput: { backgroundColor: "#f1f5f9" },
  inputButton: {
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  inputButtonText: { fontSize: 16 },
  button: { backgroundColor: "#2563eb", paddingVertical: 16, borderRadius: 8, alignItems: "center", marginTop: 16 },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});
