import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect, Stack } from "expo-router";
import { ProductTemplate, createProduct } from "@/services/ProductService";
import { Shelf, getAllShelvesInStock } from "@/services/ShelfService";
import { useStock } from "@/context/StockContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { ProductType, LoteType } from "@/constants/Enums";
import PickerModal from "@/components/PickerModal";

export default function ProductFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { stockId } = useStock();

  const [ean, setEan] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<keyof typeof ProductType>("GENERICO");
  const [loteType, setLoteType] = useState<keyof typeof LoteType>("UNIDADE");
  const [loteAmount, setLoteAmount] = useState("");
  const [weight, setWeight] = useState("");
  const [quantity, setQuantity] = useState("");
  const [validity, setValidity] = useState("");
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
  const [position, setPosition] = useState<{ row: number; column: number } | null>(null);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [isShelvesLoading, setIsShelvesLoading] = useState(true);
  const [isTypePickerVisible, setTypePickerVisible] = useState(false);
  const [isLotePickerVisible, setLotePickerVisible] = useState(false);
  const [isShelfPickerVisible, setShelfPickerVisible] = useState(false);
  const [templateImageUrl, setTemplateImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (params.template) {
      const parsedTemplate = JSON.parse(params.template as string) as ProductTemplate;
      setName(parsedTemplate.name);
      setEan(parsedTemplate.ean);
      setDescription(parsedTemplate.description || "");
      setType(parsedTemplate.type as keyof typeof ProductType);
      setLoteType(parsedTemplate.loteType as keyof typeof LoteType);
      setLoteAmount(parsedTemplate.loteAmount.toString());
      setWeight(parsedTemplate.weight?.toString() || "");

      if (parsedTemplate.image) {
        setTemplateImageUrl(`${process.env.EXPO_PUBLIC_API_URL}${parsedTemplate.image}`);
      }
    }
  }, [params.template]);

  useEffect(() => {
    if (stockId) {
      setIsShelvesLoading(true);
      getAllShelvesInStock(stockId)
        .then(setShelves)
        .catch(() => Alert.alert("Erro", "Não foi possível carregar as prateleiras."))
        .finally(() => setIsShelvesLoading(false));
    }
  }, [stockId]);

  useFocusEffect(
    useCallback(() => {
      const { shelfId, row, column } = params;
      if (shelfId && row && column) {
        const shelf = shelves.find((s) => s.id === parseInt(shelfId as string, 10));

        if (shelf && selectedShelf?.id !== shelf.id) {
          setSelectedShelf(shelf);
        }
        const newPosition = { row: parseInt(row as string), column: parseInt(column as string) };
        if (position?.row !== newPosition.row || position?.column !== newPosition.column) {
          setPosition(newPosition);
        }
      }
    }, [params.shelfId, params.row, params.column, shelves])
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
      setTemplateImageUrl(null);
    }
  };

  const handleSelectLocation = () => {
    if (!selectedShelf) {
      Alert.alert("Atenção", "Por favor, selecione uma prateleira primeiro.");
      return;
    }

    const currentFormData = {
      name,
      ean,
      description,
      type,
      loteType,
      loteAmount,
      weight,
      quantity,
      validity,
      template: params.template,
    };

    router.push({
      pathname: `/(shelf)/${selectedShelf.id}`,
      params: { mode: "select" },
    });
  };

  const handleSave = async () => {
    if (!name || !quantity || !selectedShelf || !position || !ean || !loteAmount) {
      Alert.alert(
        "Campos Obrigatórios",
        "Por favor, preencha EAN, nome, quantidade, prateleira, posição e qtd. por lote."
      );
      return;
    }

    setIsLoading(true);

    const productData = {
      name,
      ean,
      description,
      type,
      loteType,
      loteAmount: parseInt(loteAmount, 10),
      weight: weight ? parseFloat(weight.replace(",", ".")) : null,
      quantity: parseInt(quantity, 10),
      validity,
      shelfId: selectedShelf.id,
      row: position.row,
      column: position.column,
    };

    try {
      const createdProduct = await createProduct(productData, image);
      Alert.alert("Sucesso", "Produto criado com sucesso!");

      router.push(`/(product)/${createdProduct.id}`);
    } catch (error: any) {
      let errorMessage = "Não foi possível salvar o produto.";
      if (error.response?.data) {
        const errorData = error.response.data;
        if (Array.isArray(errorData.issues) && errorData.issues.length > 0) {
          errorMessage = errorData.issues[0].message;
        } else if (typeof errorData === "object") {
          errorMessage = Object.values(errorData)[0] as string;
        }
      }
      Alert.alert("Erro ao Salvar", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const displayImageUri = image?.uri || templateImageUrl;
  const availableShelves = shelves.filter((shelf) => !shelf.full);
  const typeItems = Object.keys(ProductType).map((key) => ({ label: key, value: key }));
  const loteItems = Object.keys(LoteType).map((key) => ({ label: key, value: key }));
  const shelfItems = availableShelves.map((s) => ({ label: `Prateleira ${s.id} (${s.destination})`, value: s.id }));

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Novo Produto" }} />
      <ScrollView contentContainerStyle={styles.form}>
        <PickerModal
          title="Selecione o Tipo"
          visible={isTypePickerVisible}
          items={typeItems}
          onClose={() => setTypePickerVisible(false)}
          onSelect={(item) => {
            setType(item);
            setTypePickerVisible(false);
          }}
        />
        <PickerModal
          title="Selecione o Tipo de Lote"
          visible={isLotePickerVisible}
          items={loteItems}
          onClose={() => setLotePickerVisible(false)}
          onSelect={(item) => {
            setLoteType(item);
            setLotePickerVisible(false);
          }}
        />
        <PickerModal
          title="Selecione a Prateleira"
          visible={isShelfPickerVisible}
          items={shelfItems}
          onClose={() => setShelfPickerVisible(false)}
          isLoading={isShelvesLoading}
          onSelect={(id) => {
            const shelf = shelves.find((s) => s.id === id);
            setSelectedShelf(shelf || null);
            setPosition(null);
            setShelfPickerVisible(false);
          }}
        />

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {displayImageUri ? (
            <Image source={{ uri: displayImageUri }} style={styles.imagePreview} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={32} color="#64748b" />
              <Text style={styles.imagePickerText}>Adicionar Imagem</Text>
            </>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={ean}
          onChangeText={setEan}
          placeholder="EAN (código de barras)"
          keyboardType="numeric"
        />
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nome do Produto" />
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Descrição (Opcional)"
          multiline
        />

        <View style={styles.row}>
          <TouchableOpacity style={styles.inputButtonHalf} onPress={() => setTypePickerVisible(true)}>
            <Text style={styles.inputButtonText}>{type}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inputButtonHalf} onPress={() => setLotePickerVisible(true)}>
            <Text style={styles.inputButtonText}>{loteType}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.inputHalf]}
            value={loteAmount}
            onChangeText={setLoteAmount}
            placeholder="Qtd. por Lote"
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.inputHalf]}
            value={weight}
            onChangeText={setWeight}
            placeholder="Peso (kg, opcional)"
            keyboardType="decimal-pad"
          />
        </View>

        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Quantidade em Estoque"
          keyboardType="numeric"
        />
        <TextInput style={styles.input} value={validity} onChangeText={setValidity} placeholder="Validade (Opcional)" />

        <TouchableOpacity
          style={[styles.inputButton, isShelvesLoading && styles.disabledButton]}
          onPress={() => setShelfPickerVisible(true)}
          disabled={isShelvesLoading}
        >
          {isShelvesLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.inputButtonText}>
              {selectedShelf
                ? `Prateleira ${selectedShelf.id} (${selectedShelf.destination})`
                : "Selecionar Prateleira"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.inputButton, !selectedShelf && styles.disabledButton]}
          onPress={handleSelectLocation}
          disabled={!selectedShelf}
        >
          <Text style={styles.inputButtonText}>
            {position
              ? `Posição: Linha ${position.row}, Coluna ${position.column}`
              : "Posição: (Toque para selecionar)"}
          </Text>
          <Ionicons name="grid-outline" size={20} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Salvar Produto</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  form: { padding: 24, gap: 16, paddingBottom: 50 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 16 },
  input: {
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0f172a",
  },
  inputHalf: { flex: 1 },
  textArea: { height: 100, textAlignVertical: "top", paddingTop: 12 },
  inputButton: {
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  inputButtonHalf: {
    flex: 1,
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  inputButtonText: { fontSize: 16, color: "#0f172a" },
  disabledButton: { backgroundColor: "#f1f5f9" },
  button: { backgroundColor: "#2563eb", paddingVertical: 16, borderRadius: 8, alignItems: "center", marginTop: 16 },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  imagePicker: {
    height: 120,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
  },
  imagePickerText: { marginTop: 8, color: "#64748b", fontSize: 14 },
  imagePreview: { width: "100%", height: "100%", borderRadius: 8 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
