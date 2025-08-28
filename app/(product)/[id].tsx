import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { getProductById, Product } from "@/services/ProductService";
import { Image } from "expo-image";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const productId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
      if (!isNaN(productId)) {
        fetchProductDetails(productId);
      }
    }
  }, [id]);

  const fetchProductDetails = async (productId: number) => {
    setIsLoading(true);
    try {
      const data = await getProductById(productId);
      setProduct(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os detalhes do produto.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatWeight = (weight: number | null | undefined) => {
    if (weight == null) return "N/A";
    return `${weight.toFixed(2).replace(".", ",")} kg`;
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#2563eb" style={styles.centered} />;
  }

  if (!product) {
    return <Text style={styles.errorText}>Produto não encontrado.</Text>;
  }

  const imageUrl = product.image ? `${process.env.EXPO_PUBLIC_API_URL}${product.image}` : null;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Detalhes do Produto" }} />

      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>Produto</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.description}>{product.description || "Sem descrição"}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Informações do Produto</Text>
        <View style={styles.infoGrid}>
          <InfoRow label="Quantidade" value={product.quantity} />
          <InfoRow label="Tipo" value={product.type} />
          <InfoRow label="Tipo de Lote" value={product.lote_type} />
          <InfoRow label="Qtd. por Lote" value={product.lote_amount} />
          <InfoRow label="Peso" value={formatWeight(product.weight)} />
          <InfoRow label="Validade" value={product.validity || "N/A"} />
        </View>
        <View style={styles.locationContainer}>
          <Text style={styles.infoLabel}>Localização</Text>
          <Text style={styles.infoValue}>
            Estoque Principal / Prat. {product.shelf_id} (L:{product.row}, C:
            {product.column})
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => alert("Ajustar quantidade em breve!")}>
        <Text style={styles.buttonText}>Ajustar Quantidade</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string | number | undefined | null }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#64748b",
  },
  imageContainer: {
    padding: 24,
    paddingBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#e2e8f0",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3b82f6",
  },
  placeholderText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    paddingHorizontal: 24,
  },
  description: {
    fontSize: 16,
    color: "#64748b",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: "white",
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 12,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoRow: {
    width: "48%",
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  locationContainer: {
    marginTop: 8,
  },
  button: {
    margin: 24,
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
});
