import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { searchTemplatesByName, ProductTemplate, getTemplateByEan } from "@/services/ProductService";
import BarcodeScannerModal from "@/components/BarcodeScannerModal";

export default function SearchTemplateScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);

  const handleSearch = async () => {
    if (query.trim().length < 2) {
      Alert.alert("Busca Inválida", "Digite ao menos 2 caracteres para buscar.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await searchTemplatesByName(query);
      console.log(data);
      setResults(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar a busca.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarcodeScanned = async (ean: string) => {
    setScannerVisible(false);
    setIsLoading(true);
    try {
      const template = await getTemplateByEan(ean);
      if (template) {
        handleSelectTemplate(template);
      } else {
        Alert.alert(
          "Template não encontrado",
          "Nenhum template encontrado com este EAN. Você pode cadastrá-lo do zero."
        );
      }
    } catch (error) {
      Alert.alert("Template não encontrado", "Nenhum template encontrado com este EAN. Você pode cadastrá-lo do zero.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (template: ProductTemplate) => {
    router.push({
      pathname: "/(product)/form",
      params: { template: JSON.stringify(template) },
    });
  };

  const handleCreateFromScratch = () => {
    router.push("/(product)/form");
  };

  const renderItem = ({ item }: { item: ProductTemplate }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleSelectTemplate(item)}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardSubtitle}>EAN: {item.ean}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <BarcodeScannerModal
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onBarcodeScanned={handleBarcodeScanned}
      />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome do template..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.cameraButton} onPress={() => setScannerVisible(true)}>
          <Ionicons name="camera-outline" size={24} color="#4b5563" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.ean.toString()}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum template encontrado.</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.outlineButton} onPress={handleCreateFromScratch}>
        <Text style={styles.outlineButtonText}>Não encontrou? Cadastre um novo</Text>
      </TouchableOpacity>
    </View>
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
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  emptyText: {
    color: "#64748b",
  },
  outlineButton: {
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2563eb",
    alignItems: "center",
    marginTop: 16,
  },
  outlineButtonText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "600",
  },
});
