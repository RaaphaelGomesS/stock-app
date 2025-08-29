// app/(product)/create.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { createProduct } from "@/services/ProductService";
import { getItem, removeItem } from "@/services/storage";

interface Position {
  shelfId: number;
  shelfName: string;
  row: number;
  column: number;
}

export default function NewProductScreen() {
  const router = useRouter();

  const [ean, setEan] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [lotType, setLotType] = useState("");
  const [quantityPerLot, setQuantityPerLot] = useState("");
  const [weight, setWeight] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const checkSelectedPosition = async () => {
        const positionStr = await getItem("selectedPosition");
        if (positionStr) {
          setSelectedPosition(JSON.parse(positionStr));
          await removeItem("selectedPosition");
        }
      };
      checkSelectedPosition();
    }, [])
  );

  const handleSelectPosition = () => {
    // TODO: Substituir por um seletor de prateleiras real.
    // O usuário precisa primeiro escolher uma prateleira para depois ver o grid.
    const shelfIdToSelect = 1; // ID fixo para teste

    router.push(`/(product)/shelf/${shelfIdToSelect}?mode=select` as any);
  };

  const handleSave = async () => {
    if (!name || !quantity || !selectedPosition) {
      Alert.alert("Erro", "Nome, Quantidade e Posição são obrigatórios.");
      return;
    }

    const productData = {
      ean,
      name,
      description,
      type,
      lotType,
      quantityPerLot: parseInt(quantityPerLot) || 0,
      weight: parseFloat(weight) || 0,
      quantity: parseInt(quantity, 10),
      expiryDate,
      shelfId: selectedPosition.shelfId,
      // Enviando a posição 0-indexada para o back-end, como pediu o Raphael
      position: {
        row: selectedPosition.row,
        column: selectedPosition.column,
      }
    };

    try {
      await createProduct(productData as any);
      Alert.alert("Sucesso", "Produto criado com sucesso!");
      router.back();
    } catch (error) {
      let errorMessage = "Ocorreu um erro ao criar o produto.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert("Erro", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerTitle}>Novo Produto</Text>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="EAN (código de barras)" value={ean} onChangeText={setEan} />
          <TextInput style={styles.input} placeholder="Nome do Produto" value={name} onChangeText={setName} />
          <TextInput style={[styles.input, styles.textarea]} placeholder="Descrição (Opcional)" value={description} onChangeText={setDescription} multiline />
          <View style={styles.row}>
            <TextInput style={styles.inputRow} placeholder="Tipo" value={type} onChangeText={setType} />
            <TextInput style={styles.inputRow} placeholder="Tipo de Lote" value={lotType} onChangeText={setLotType} />
          </View>
          <View style={styles.row}>
            <TextInput style={styles.inputRow} placeholder="Qtd. por Lote" value={quantityPerLot} onChangeText={setQuantityPerLot} keyboardType="numeric" />
            <TextInput style={styles.inputRow} placeholder="Peso (kg, opcional)" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
          </View>
          <TextInput style={styles.input} placeholder="Quantidade em Estoque" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Validade (Opcional, DD/MM/AAAA)" value={expiryDate} onChangeText={setExpiryDate} />
          <TouchableOpacity style={styles.positionButton} onPress={handleSelectPosition}>
            <Text style={styles.positionButtonText}>
              {selectedPosition
                ? `${selectedPosition.shelfName} (L: ${selectedPosition.row + 1}, C: ${selectedPosition.column + 1})`
                : "Posição: (Toque para selecionar)"}
            </Text>
            <Ionicons name="grid-outline" size={20} color="#475569" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar Produto</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos (sem alterações)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContainer: { padding: 24 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#0f172a', marginBottom: 24, textAlign: 'center' },
  form: { width: '100%', gap: 16 },
  input: { width: '100%', height: 56, backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', paddingHorizontal: 16, fontSize: 16 },
  textarea: { height: 100, textAlignVertical: 'top', paddingTop: 16 },
  row: { flexDirection: 'row', gap: 16 },
  inputRow: { flex: 1, height: 56, backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', paddingHorizontal: 16, fontSize: 16 },
  positionButton: { height: 56, backgroundColor: '#f1f5f9', borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  positionButtonText: { fontSize: 16, color: '#475569' },
  button: { width: '100%', backgroundColor: '#2563eb', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 32 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});