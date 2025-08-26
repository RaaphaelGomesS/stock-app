import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useStock } from "../../context/StockContext";
import { getAllStocks } from "../../services/StockService";
import { Ionicons } from "@expo/vector-icons";

interface Stock {
  id: number;
  name: string;
  description: string | null;
}

export default function SelectStockScreen() {
  const router = useRouter();
  const { selectStock } = useStock();
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    async function fetchStocks() {
      try {
        const response = await getAllStocks();
        setStocks(response.data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível buscar seus estoques.");
      }
    }
    fetchStocks();
  }, []);

  const handleSelectStock = async (id: number) => {
    await selectStock(id);
    router.replace("/");
  };

  const navigateToForm = (stock?: Stock) => {
    if (stock) {
      router.push({
        pathname: "/(stock)/form",
        params: { id: stock.id, name: stock.name, description: stock.description },
      });
    } else {
      router.push("/(stock)/form");
    }
  };

  const renderStockItem = ({ item }: { item: Stock }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => navigateToForm(item)}>
            <Ionicons name="pencil" size={20} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="trash-outline" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.selectButton} onPress={() => handleSelectStock(item.id)}>
        <Text style={styles.selectButtonText}>Selecionar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Estoques</Text>
      </View>
      <FlatList
        data={stocks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStockItem}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <Text style={styles.subtitle}>Selecione um estoque para começar a gerenciar ou crie um novo.</Text>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigateToForm()}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 24,
  },
  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,

    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  cardDescription: {
    fontSize: 14,
    color: "#64748b",
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  selectButton: {
    backgroundColor: "#eff6ff",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  selectButtonText: {
    color: "#1d4ed8",
    fontWeight: "600",
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
