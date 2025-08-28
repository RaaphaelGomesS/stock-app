import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getUser, deleteUser } from "../../services/UserService";
import { useAuth } from "../../context/AuthContext";
import { isAxiosError } from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UserDashboardScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        setIsLoading(true);
        try {
          const userData = await getUser();
          setUser(userData);
        } catch (error) {
          Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchUser();
    }, [])
  );

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              if (user) {
                await deleteUser(user.id);
                Alert.alert("Sucesso", "Sua conta foi excluída.");
                signOut();
              }
            } catch (error) {
              let errorMessage = "Não foi possível excluir a conta.";
              if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
              }
              Alert.alert("Erro", errorMessage);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (!user) {
    return <Text style={styles.errorText}>Não foi possível carregar as informações.</Text>;
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/(user)/edit",
              params: { id: user.id.toString(), name: user.name, email: user.email },
            })
          }
        >
          <Text style={styles.buttonText}>Atualizar Informações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={[styles.buttonText, styles.buttonText]}>Excluir Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f8fafc"
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    flex: 1,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#64748b",
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    color: "#0f172a",
    backgroundColor: "#f1f5f9",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  buttonContainer: {
    gap: 16,
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
  deleteButton: {
    backgroundColor: "#ef4444",
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
});
