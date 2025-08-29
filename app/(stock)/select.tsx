import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useStock } from "../../context/StockContext";
import { getAllStocks, deleteStock } from "../../services/StockService";
import { Ionicons } from "@expo/vector-icons";
import { isAxiosError } from "axios";
import { FAB } from "@/components/FAB";

interface Stock {
  id: number;
  name: string;
  description: string | null;
}

export default function SelectStockScreen() {
  const router = useRouter();
  const { selectStock } = useStock();
  const [stocks, setStocks] = useState<Stock[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchStocks = async () => {
        try {
          const freshStocks = await getAllStocks();
          setStocks(freshStocks);
        } catch (error) {
          Alert.alert("Erro", "Não foi possível buscar seus estoques.");
        }
      };

      fetchStocks();
    }, [stocks])
  );

  const handleDeleteStock = (stock: Stock) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Você tem certeza que deseja excluir o estoque "${stock.name}"? Todos os produtos e prateleiras contidos nele serão perdidos.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteStock(stock.id);
              Alert.alert("Sucesso", "Estoque excluído com sucesso.");
              setStocks((currentStocks) => currentStocks.filter((s) => s.id !== stock.id));
            } catch (error) {
              let errorMessage = "Não foi possível excluir o estoque.";
              if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || errorMessage;
              }
              Alert.alert("Erro", errorMessage);
            }
          },
        },
      ]
    );
  };

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
            <Ionicons name="pencil" size={20} color="#000000ff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteStock(item)}>
            <Ionicons name="trash" size={20} color="#000000ff" />
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
      <FlatList
        data={stocks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStockItem}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <Text style={styles.subtitle}>Selecione um estoque para começar a gerenciar ou crie um novo.</Text>
        }
      />
      <FAB onPress={() => navigateToForm()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
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
});
