import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { getShelfLayout, ShelfLayout } from "@/services/ShelfService";
import { Product } from "@/services/ProductService";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

const SPACING = 8;

export default function ShelfGridScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{ shelfId: string; mode?: "select" | "view"; originalParams?: string }>();
  const { shelfId, mode = "view", originalParams } = params;

  const [layout, setLayout] = useState<ShelfLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shelfInfo, setShelfInfo] = useState<{ rows: number; columns: number } | null>(null);

  useEffect(() => {
    const id = parseInt(shelfId, 10);
    if (!isNaN(id)) {
      fetchLayout(id);
    }
  }, [shelfId]);

  const fetchLayout = async (id: number) => {
    setIsLoading(true);
    try {
      const data = await getShelfLayout(id);
      if (data && data.length > 0) {
        setLayout(data);
        setShelfInfo({ rows: data.length, columns: data[0]?.length || 1 });
      } else {
        setLayout([]);
        setShelfInfo({ rows: 0, columns: 0 });
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o layout da prateleira.");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCellPress = (product: Product | null, row: number, column: number) => {
    if (mode === "select") {
      if (product) {
        Alert.alert("Posição Ocupada", "Este local já contém um produto. Por favor, escolha um espaço vazio.");
        return;
      }
      const parsedOriginalParams = originalParams ? JSON.parse(originalParams) : {};
      router.replace({
        pathname: "/(product)/form",
        params: { ...parsedOriginalParams, shelfId, row: row.toString(), column: column.toString() },
      });
    } else {
      if (product) {
        router.push(`/product/${product.id}`);
      }
    }
  };

  if (isLoading) return <ActivityIndicator style={styles.centered} size="large" />;

  const numColumns = shelfInfo?.columns || 1;
  const itemSize = (width - SPACING * (numColumns + 1)) / numColumns;

  if (numColumns === 0) {
    return (
      <View style={styles.centered}>
        <Text>Esta prateleira não possui colunas definidas.</Text>
      </View>
    );
  }

  const gridData = layout
    ? layout.flat().map((product, index) => ({
        product,
        row: Math.floor(index / numColumns),
        column: index % numColumns,
      }))
    : [];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Prateleira ${shelfId}` }} />
      <Text style={styles.subtitle}>
        {mode === "select" ? "Toque em um espaço vazio para selecionar" : "Toque em um produto para ver os detalhes"}
      </Text>

      <FlatList
        data={gridData}
        keyExtractor={(item) => `${item.row}-${item.column}`}
        numColumns={numColumns}
        key={numColumns}
        renderItem={({ item }) => {
          const { product } = item;
          const isOccupied = !!product;
          return (
            <TouchableOpacity
              style={[
                styles.cell,
                { width: itemSize, height: itemSize, margin: SPACING / 2 },
                isOccupied ? styles.occupiedCell : styles.emptyCell,
              ]}
              onPress={() => handleCellPress(item.product, item.row, item.column)}
            >
              {isOccupied ? (
                <>
                  <View style={[styles.productIcon, { backgroundColor: product.image ? "transparent" : "#3b82f6" }]}>
                    {product.image ? (
                      <Image
                        source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${product.image}` }}
                        style={styles.productImage}
                      />
                    ) : (
                      <Text style={styles.productInitial}>{product.name.charAt(0).toUpperCase()}</Text>
                    )}
                  </View>
                  <Text numberOfLines={2} style={styles.productName}>
                    {product.name}
                  </Text>
                </>
              ) : (
                <Text style={styles.cellText}>Vazio</Text>
              )}
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ alignItems: "center" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingTop: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  subtitle: { textAlign: "center", color: "#64748b", marginBottom: 20, fontSize: 16 },
  cell: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  emptyCell: { backgroundColor: "#f1f5f9", borderWidth: 1, borderColor: "#e2e8f0" },
  occupiedCell: { backgroundColor: "white", borderWidth: 1, borderColor: "#3b82f6" },
  cellText: { color: "#94a3b8", fontSize: 12 },
  productIcon: {
    width: "60%",
    height: "60%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  productInitial: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  productName: {
    fontSize: 10,
    textAlign: "center",
    color: "#1e293b",
  },
});
