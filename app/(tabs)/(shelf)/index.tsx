import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useStock } from "@/context/StockContext";
import { getAllShelvesInStock, Shelf } from "@/services/ShelfService";
import { Ionicons } from "@expo/vector-icons";

export default function ShelfListScreen() {
  const router = useRouter();
  const { stockId } = useStock();
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (stockId) {
        fetchShelves(stockId);
      }
    }, [stockId])
  );

  const fetchShelves = async (id: number) => {
    setIsLoading(true);
    try {
      const data = await getAllShelvesInStock(id);
      setShelves(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as prateleiras.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShelfPress = (shelfId: number) => {
    router.push({
      pathname: `/(shelf)/${shelfId}`,
      params: { mode: "view" },
    });
  };

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={shelves}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleShelfPress(item.id)}>
            <Ionicons name="grid-outline" size={24} color="#3b82f6" />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Prateleira {item.id}</Text>
              <Text style={styles.cardSubtitle}>
                {item.rows} linhas x {item.columns} colunas
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma prateleira encontrada neste estoque.</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => alert("Formulário de prateleira em breve!")}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardText: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  cardSubtitle: {
    color: "#64748b",
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#64748b",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
});
