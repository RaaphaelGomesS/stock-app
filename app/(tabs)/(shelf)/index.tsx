import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, SafeAreaView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useStock } from "@/context/StockContext";
import { getAllShelvesInStock, deleteShelf, Shelf } from "@/services/ShelfService";
import ActionCard from "@/components/ActionCard";
import { FAB } from "@/components/FAB";

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

  const handleDelete = (shelf: Shelf) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a Prateleira ${shelf.id}? Todos os produtos contidos nela serão perdidos.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteShelf(shelf.id);
            fetchShelves(stockId!);
          },
        },
      ]
    );
  };

  const handleEdit = (shelf: Shelf) => {
    router.push({
      pathname: "/form",
      params: { shelf: JSON.stringify(shelf) },
    });
  };

  const handleAccess = (shelfId: number) => {
    router.push(`/(shelf)/${shelfId}`);
  };

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={shelves}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const capacity = item.rows * item.columns;
          const occupied = item._count?.product ?? 0;
          return (
            <ActionCard
              title={`Prateleira ${item.id}`}
              onPress={() => handleAccess(item.id)}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item)}
            >
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Destino: {item.destination}</Text>
                <Text style={styles.infoText}>
                  Dimensões: {item.rows}x{item.columns}
                </Text>
                <Text style={styles.infoText}>
                  Ocupação: {occupied}/{capacity}
                </Text>
              </View>
            </ActionCard>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma prateleira encontrada. Toque em '+' para adicionar.</Text>
        }
        contentContainerStyle={{ padding: 16 }}
      />
      <FAB onPress={() => router.push("/(shelf)/form")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#64748b" },
  infoContainer: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 4,
  },
});
