import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { updateUser } from "../../services/UserService";
import { isAxiosError } from "axios";

export default function UserEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setName((params.name as string) || "");
    setEmail((params.email as string) || "");
  }, [params]);

  const handleUpdate = async () => {
    if (!name || !email) {
      Alert.alert("Erro", "Nome e email são obrigatórios.");
      return;
    }

    const userData: { name: string; email: string; password?: string } = {
      name,
      email,
    };

    if (password) {
      userData.password = password;
    }

    try {
      await updateUser(parseInt(params.id as string), userData);
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      router.back();
    } catch (error) {
      let errorMessage = "Não foi possível atualizar os dados.";
      if (isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        if (Array.isArray(errorData.issues) && errorData.issues.length > 0) {
          errorMessage = errorData.issues[0].message;
        } else if (typeof errorData === "object" && errorData !== null && Object.values(errorData).length > 0) {
          errorMessage = Object.values(errorData)[0] as string;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert("Erro na Atualização", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nova Senha (deixe em branco para não alterar)</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="********"
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f8fafc",
    justifyContent: "space-between",
  },
  fieldContainer: {
    marginBottom: 16,
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
  button: {
    width: "100%",
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
