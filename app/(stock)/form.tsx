import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { updateStock, createStock } from "@/services/StockService";
import { isAxiosError } from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StockFormScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const isEditMode = params.id != null;

  const [name, setName] = useState((params.name as string) || "");
  const [description, setDescription] = useState((params.description as string) || "");

  useEffect(() => {
    navigation.setOptions({
      title: isEditMode ? "Editar Estoque" : "Novo Estoque",
    });
  }, [isEditMode]);

  const handleSave = async () => {
    if (!name) {
      Alert.alert("Erro", "O nome do estoque é obrigatório.");
      return;
    }

    const stockData = { name, description };

    try {
      if (isEditMode) {
        await updateStock(params.id, stockData);
        Alert.alert("Sucesso", "Estoque atualizado com sucesso!");
      } else {
        await createStock(stockData);
        Alert.alert("Sucesso", "Estoque criado com sucesso!");
      }
      router.push("/(stock)/select");
    } catch (error) {
      let errorMessage = "Ocorreu um erro ao salvar o estoque.";
      if (isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        if (Array.isArray(errorData.issues) && errorData.issues.length > 0) {
          errorMessage = errorData.issues[0].message;
        } else if (typeof errorData === "object" && errorData !== null && Object.values(errorData).length > 0) {
          errorMessage = Object.values(errorData)[0] as string;
        }
      }
      Alert.alert("Erro", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={80}
      >
        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Nome do Estoque</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Estoque Principal"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View>
            <Text style={styles.label}>Descrição (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Ex: Depósito central de produtos"
              placeholderTextColor="#9ca3af"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>{isEditMode ? "Editar estoque" : "Salvar estoque"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 24,
    justifyContent: "space-between",
  },
  form: {
    width: "100%",
    gap: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textarea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  button: {
    width: "100%",
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
