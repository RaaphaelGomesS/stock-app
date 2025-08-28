import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { ProductTemplate } from "@/services/ProductService";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

export default function ProductFormScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const { template: templateParam } = useLocalSearchParams<{ template?: string }>();

  const [template, setTemplate] = useState<ProductTemplate | null>(null);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const [name, setName] = useState("");
  const [ean, setEan] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (templateParam) {
      try {
        const parsedTemplate = JSON.parse(templateParam) as ProductTemplate;
        setTemplate(parsedTemplate);

        setName(parsedTemplate.name);
        setEan(parsedTemplate.ean.toString());
      } catch (e) {
        console.error("Falha ao processar o template:", e);
        Alert.alert("Erro", "Não foi possível carregar os dados do template.");
      }
    }
  }, [templateParam]);

  useEffect(() => {
    const title = "Cadastrar novo produto";
    navigation.setOptions({ title });
  }, [templateParam, navigation]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSelectLocation = () => {
    router.push({
      pathname: "/(product)/selectLocation",
    });
  };

  const handleSave = () => {
    Alert.alert("Salvar", "A funcionalidade de salvar será implementada em breve.");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
          ) : (
            <>
              <Ionicons name="camera" size={32} color="#64748b" />
              <Text style={styles.imagePickerText}>Adicionar Imagem</Text>
            </>
          )}
        </TouchableOpacity>

        <View>
          <Text style={styles.label}>Nome do Produto</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>
        <View>
          <Text style={styles.label}>EAN</Text>
          <TextInput style={styles.input} value={ean} onChangeText={setEan} keyboardType="numeric" />
        </View>
        <View>
          <Text style={styles.label}>Quantidade Inicial</Text>
          <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
        </View>

        <View>
          <Text style={styles.label}>Prateleira</Text>
          <TouchableOpacity style={styles.inputButton} onPress={() => alert("Seleção de prateleira em breve")}>
            <Text>Selecionar Prateleira</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.label}>Posição na Prateleira</Text>
          <TouchableOpacity style={styles.inputButton} onPress={handleSelectLocation}>
            <Text>Selecionar Posição</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar Produto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  form: { padding: 24, gap: 16 },
  label: { fontSize: 14, fontWeight: "500", color: "#334155", marginBottom: 4 },
  input: {
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputButton: {
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 12,
    justifyContent: "center",
  },
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
  imagePickerText: {
    marginTop: 8,
    color: "#64748b",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});
