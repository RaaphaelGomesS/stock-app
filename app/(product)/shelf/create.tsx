// app/(product)/shelf/create.tsx

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
  ScrollView,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { createShelf } from "@/services/ShelfService";
import { Shelf } from "@/types/shelf"; // Importamos o tipo Shelf

export default function NewShelfScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [rows, setRows] = useState("");
  const [columns, setColumns] = useState("");
  const [destinationType, setDestinationType] = useState("");
  const [restrictions, setRestrictions] = useState("");

  useEffect(() => {
    navigation.setOptions({
      title: "Nova Prateleira",
    });
  }, []);

  const handleSave = async () => {
    if (!name || !rows || !columns) {
      Alert.alert("Erro", "Por favor, preencha o Nome, Linhas e Colunas.");
      return;
    }

    // CORREÇÃO 1: Definimos explicitamente o tipo do nosso objeto de dados.
    // Isso garante que ele corresponda exatamente ao que o serviço espera.
    const shelfData: Omit<Shelf, "id"> = {
      name,
      rows: parseInt(rows, 10),
      columns: parseInt(columns, 10),
      destinationType: destinationType || undefined, // Usamos undefined para campos opcionais
      restrictions: restrictions || undefined,
    };

    try {
      await createShelf(shelfData);
      Alert.alert("Sucesso", "Prateleira criada com sucesso!");
      router.back();
    } catch (error) {
      // CORREÇÃO 2: Verificamos se o 'error' é uma instância de Error
      // antes de tentar acessar 'error.message'.
      let errorMessage = "Ocorreu um erro ao criar a prateleira.";
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
        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Nome da Prateleira</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Prateleira A do Corredor 1"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#94a3b8"
            />
          </View>
          
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Linhas</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 10"
                value={rows}
                onChangeText={setRows}
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Colunas</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 8"
                value={columns}
                onChangeText={setColumns}
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
          
          <View>
            <Text style={styles.label}>Tipo de Destino (Opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: GENERICO"
              value={destinationType}
              onChangeText={setDestinationType}
              placeholderTextColor="#94a3b8"
            />
          </View>
          
          <View>
            <Text style={styles.label}>Restrições (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Ex: Apenas produtos frágeis"
              value={restrictions}
              onChangeText={setRestrictions}
              multiline
              numberOfLines={3}
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar Prateleira</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos (sem alterações)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 24,
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
    height: 56,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0f172a",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  column: {
    flex: 1,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 32,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});