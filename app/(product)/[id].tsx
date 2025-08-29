import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter, useFocusEffect } from "expo-router";
import { getProductById, deleteProduct, adjustQuantity, Product } from "@/services/ProductService";
import { Image } from "expo-image";
import { isAxiosError } from "axios";

// --- Componente para o Modal de Ajuste de Quantidade ---
const AdjustQuantityModal = ({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    const numericAmount = parseInt(amount, 10);
    if (isNaN(numericAmount) || numericAmount === 0) {
      Alert.alert("Valor Inválido", "Por favor, insira um número inteiro diferente de zero.");
      return;
    }
    onSubmit(numericAmount);
    setAmount(""); // Limpa o input após o envio
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Ajustar Quantidade</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Ex: 5 (adicionar) ou -2 (remover)"
            placeholderTextColor="#94a3b8"
            keyboardType="number-pad"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Confirmar Ajuste</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// --- Tela Principal de Detalhes do Produto ---
export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdjustModalVisible, setAdjustModalVisible] = useState(false);

  // useFocusEffect garante que os dados sejam recarregados sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      if (id) {
        const productId = parseInt(id as string, 10);
        if (!isNaN(productId)) {
          fetchProductDetails(productId);
        }
      }
    }, [id])
  );

  const fetchProductDetails = async (productId: number) => {
    setIsLoading(true);
    try {
      const data = await getProductById(productId);
      setProduct(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os detalhes do produto.");
      if (router.canGoBack()) router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (!product) return;
    // Navega para a tela de formulário, passando o ID para entrar em "modo de edição"
    router.push({
      pathname: "/(product)/form",
      params: { productId: product.id.toString() },
    });
  };

  const handleDelete = () => {
    if (!product) return;
    Alert.alert(
      "Confirmar Exclusão",
      `Você tem certeza que deseja excluir o produto "${product.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(product.id);
              Alert.alert("Sucesso", "Produto excluído com sucesso.");
              router.back(); // Volta para a tela anterior
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o produto.");
            }
          },
        },
      ]
    );
  };

  const handleAdjustQuantity = async (adjustment: number) => {
    if (!product) return;
    try {
      const updatedProduct = await adjustQuantity(product.id, adjustment);
      setProduct(updatedProduct); // Atualiza o estado para refletir a mudança na tela
      Alert.alert("Sucesso", "Quantidade ajustada com sucesso!");
    } catch (error) {
      let errorMessage = "Não foi possível ajustar a quantidade.";
      if (isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        errorMessage = (Object.values(errorData)[0] as string) || errorMessage;
      }
      Alert.alert("Erro", errorMessage);
    } finally {
      setAdjustModalVisible(false);
    }
  };

  const formatWeight = (weight: any): string => {
    if (weight === null || typeof weight === "undefined") {
      return "N/A";
    }
    const numericWeight = typeof weight === "string" ? parseFloat(weight) : Number(weight);
    return `${numericWeight.toFixed(2).replace(".", ",")} kg`;
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
      <Stack.Screen options={{ title: product.name || "Detalhes do Produto" }} />
      <AdjustQuantityModal
        visible={isAdjustModalVisible}
        onClose={() => setAdjustModalVisible(false)}
        onSubmit={handleAdjustQuantity}
      />

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
            Prat. {product.shelf_id} (L:{product.row}, C:{product.column})
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setAdjustModalVisible(true)}>
          <Text style={styles.buttonText}>Ajustar Quantidade</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
          <Text style={styles.buttonText}>Editar Produto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Excluir Produto</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    padding: 24,
    gap: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#f97316",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { backgroundColor: "white", padding: 24, borderRadius: 12, width: "80%", alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  modalInput: {
    height: 50,
    width: "100%",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
