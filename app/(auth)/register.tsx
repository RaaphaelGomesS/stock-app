import {
  Text,
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useRouter, Link } from "expo-router";
import { register } from "../../services/UserService";
import { isAxiosError } from "axios";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await register({ name, email, password });
      router.push("/(auth)/login");
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
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Criar Conta</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#94a3b8"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Já tem uma conta?{" "}
          <Link href="/login" asChild>
            <Text style={styles.loginLink}>Faça o login</Text>
          </Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 40,
  },
  formContainer: {
    width: "100%",
    marginBottom: 24,
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
    marginBottom: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginText: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 14,
    color: "#64748b",
  },
  loginLink: {
    fontWeight: "600",
    color: "#2563eb",
  },
});
