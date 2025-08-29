// app/(product)/shelf/index.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAllShelves } from "@/services/ShelfService";
import { Shelf } from "@/types/shelf";

export default function ShelfListScreen() {
  const router = useRouter();
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // useFocusEffect recarrega os dados toda vez que a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      fetchShelves();
    }, [])
  );

  const fetchShelves = async () => {
    try {
      setIsLoading(true);
      const data = await getAllShelves();
      setShelves(data);
    } catch (error) {
      let errorMessage = "Não foi possível buscar as prateleiras.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert("Erro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToCreateShelf = () => {
    router.push("/(product)/shelf/create");
  };

  const navigateToShelfGrid = (shelfId: number) => {
    // Navega para a tela do grid, passando o ID da prateleira
    // (Ainda vamos criar essa tela, ex: /shelf/[id].tsx)
    router.push(`/(product)/shelf/${shelfId}` as any);
  };

  const renderShelfItem = ({ item }: { item: Shelf }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigateToShelfGrid(item.id)}>
      <View style={styles.cardIcon}>
        {/* Usando um ícone genérico de grid */}
        <Ionicons name="grid-outline" size={24} color="#1d4ed8" />
      </View>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>
          {item.rows} Linhas x {item.columns} Colunas
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />
      ) : (
        <FlatList
          data={shelves}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderShelfItem}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={<Text style={styles.headerTitle}>Minhas Prateleiras</Text>}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma prateleira cadastrada.</Text>
              <Text style={styles.emptySubtext}>Toque no botão + para criar a sua primeira!</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={navigateToCreateShelf}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Estilos consistentes com o resto do projeto
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 24,
    paddingBottom: 100, // Espaço para o botão FAB não cobrir o último item
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 150,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#475569",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
  },
});