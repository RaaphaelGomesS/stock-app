// app/(product)/details/[id].tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getProductDetails } from "@/services/ProductService";
import { Product } from "@/types/product";

export default function ProductDetailsScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Adiciona botões de ação no cabeçalho
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleMoreOptions} style={{ marginRight: 16 }}>
          <Ionicons name="ellipsis-vertical" size={24} color="#1e293b" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const data = await getProductDetails(productId);
      setProduct(data);
    } catch (error) {
      let errorMessage = "Não foi possível buscar os detalhes do produto.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert("Erro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMoreOptions = () => {
    // Lógica para o menu de "mais opções" (Editar, Excluir, etc.)
    Alert.alert("Opções", "Aqui você pode adicionar ações como Editar ou Excluir o produto.");
  };

  const handleAdjustQuantity = () => {
    // Lógica para ajustar a quantidade
    Alert.alert("Ajustar Quantidade", "Esta ação abriria um modal ou outra tela para ajustar a quantidade do produto.");
  };

  // Componente para renderizar cada item de informação
  const InfoItem = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "N/A"}</Text>
    </View>
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />;
  }

  if (!product) {
    return (
      <View style={styles.loader}>
        <Text>Produto não encontrado.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="cube-outline" size={80} color="#94a3b8" />
            <Text style={styles.imagePlaceholderText}>Produto</Text>
          </View>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Informações do Produto</Text>
          <View style={styles.infoGrid}>
            <InfoItem label="Quantidade" value={product.quantity} />
            <InfoItem label="Tipo" value={product.type} />
            <InfoItem label="Tipo de Lote" value={product.lotType} />
            <InfoItem label="Qtd. por Lote" value={product.quantityPerLot} />
            <InfoItem label="Peso" value={product.weight ? `${product.weight} kg` : undefined} />
            <InfoItem label="Validade" value={product.expiryDate} />
          </View>
          <View style={styles.locationInfo}>
            <Ionicons name="location-outline" size={20} color="#475569" style={{ marginRight: 8 }}/>
            <Text style={styles.infoValue}>{product.shelfPosition}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleAdjustQuantity}>
          <Text style={styles.buttonText}>Ajustar Quantidade</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
  scrollContainer: {
    paddingBottom: 120, // Espaço para o botão flutuante no rodapé
  },
  header: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  imagePlaceholderText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#94a3b8",
    marginTop: 8,
  },
  productName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
  },
  productDescription: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
  },
  infoCard: {
    margin: 24,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardTitle: {
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
    marginBottom: 16,
  },
  infoItem: {
    width: "50%", // Cada item ocupa metade da largura
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
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
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
});