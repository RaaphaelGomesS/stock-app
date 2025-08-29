import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";
import { FAB } from "@/components/FAB";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import BarcodeScannerModal from "@/components/BarcodeScannerModal";
import { Product, getProductHistory, searchProductsByName, searchProductsByEan } from "@/services/ProductService";

export default function HomeScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const fetchHistory = async () => {
    setIsLoading(true);
    setIsSearching(false);
    setSearchQuery("");
    try {
      const history = await getProductHistory();
      setProducts(history);
    } catch (error) {
      console.error("Falha ao buscar histórico");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      fetchHistory();
      return;
    }
    setIsLoading(true);
    setIsSearching(true);
    try {
      const results = await searchProductsByName(searchQuery);
      setProducts(results);
    } catch (error) {
      console.error("Falha ao buscar produtos");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarcodeScanned = async (ean: string) => {
    setScannerVisible(false);
    setIsLoading(true);
    setIsSearching(true);

    try {
      const results = await searchProductsByEan(ean);

      if (results.length === 0) {
        Alert.alert("Nenhum Produto Encontrado", "Não há produtos cadastrados com este EAN.");
        setProducts([]);
      } else if (results.length === 1) {
        router.push(`/(product)/${results[0].id}`);
      } else {
        setProducts(results);
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao buscar pelo EAN.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductPress = (productId: number) => {
    router.push(`/(product)/${productId}`);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleProductPress(item.id)}>
      <View style={styles.cardIcon}>
        <Text style={styles.cardIconText}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>
          Qtd: {item.quantity} | Prat. {item.shelf_id}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Novo Produto</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                router.push("/(product)/searchTemplate");
              }}
            >
              <Text style={styles.modalButtonText}>Buscar por Template ou EAN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                router.push("/(product)/form");
              }}
            >
              <Text style={styles.modalButtonText}>Cadastrar do Zero</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <BarcodeScannerModal
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onBarcodeScanned={handleBarcodeScanned}
      />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar produto..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.cameraButton} onPress={() => setScannerVisible(true)}>
          <Ionicons name="camera-outline" size={24} color="#4b5563" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{isSearching ? "Resultados da Pesquisa" : "Últimas Alterações"}</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto encontrado.</Text>}
        />
      )}

      <FAB onPress={() => setModalVisible(true)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cameraButton: {
    padding: 12,
    marginLeft: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardIconText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748b",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1e293b",
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#eff6ff",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  modalButtonText: {
    color: "#1d4ed8",
    fontSize: 16,
    fontWeight: "600",
  },
  modalCancelButton: {
    backgroundColor: "#f1f5f9",
  },
  modalCancelButtonText: {
    color: "#475569",
    fontWeight: "600",
  },
});
