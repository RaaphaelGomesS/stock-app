
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';


import Input from "@/constants/components/Imput/imput";
import Row from "@/constants/components/Row/Row";
import SelectInput from "@/constants/components/Select/select";
import DateInput from "@/constants/components/Imput/DateImput";
import ImageInput, { UploadedFile } from "@/constants/components/Imagens/InputImage";
import ShelfPicker, { Shelf, ShelfSelection } from "@/constants/components/Select/SeletorDePrateleira";
import Button from "@/constants/components/Button/Button";



const ProductCreateScreen = () => {
    const [ean, setEan] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [loteType, setLoteType] = useState("");
    const [loteAmount, setLoteAmount] = useState("");
    const [weight, setWeight] = useState("");
    const [quantity, setQuantity] = useState("");
    const [validity, setValidity] = useState<string | null>(null);
    const [image, setImage] = useState<UploadedFile | null>(null);
    const [position, setPosition] = useState<ShelfSelection | null>(null);

    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchShelves = async () => {
            setLoading(true);
            try {

            } catch (error) {
                Alert.alert("Erro", "Não foi possível carregar as prateleiras.");
            } finally {
                setLoading(false);
            }
        };
        fetchShelves();
    }, []);

    const handleSave = async () => {
        if (!name || !ean || !quantity || !position) {
            Alert.alert("Erro", "Nome, EAN, Quantidade e Posição são obrigatórios.");
            return;
        }
        setIsSubmitting(true);

        const payload = {
            body: {
                name,
                ean: Number(ean),
                description,
                type,
                loteType,
                loteAmount: Number(loteAmount),
                weight: Number(weight) || null,
                quantity: Number(quantity),
                validity,
                shelfId: position.shelfId,
                row: position.row,
                column: position.column,
            },
            file: image,
        };

        try {

            console.log("Enviando CRIAÇÃO para o backend:", payload);

            Alert.alert("Sucesso!", "Produto criado com sucesso.");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível criar o produto.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#2970FF" /></View>;
    }

    const selectedShelf = shelves.find(s => s.id === position?.shelfId);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Novo Produto</Text>
            </View>

            <ImageInput onChange={setImage} />
            <Input value={ean} onChangeText={setEan} placeholder="EAN (código de barras)" keyboardType="numeric" />
            <Input value={name} onChangeText={setName} placeholder="Nome do Produto" />
            <Input value={description} onChangeText={setDescription} placeholder="Descrição (Opcional)" multiline />
            <Row>
                <SelectInput selectedValue={type} onValueChange={setType} options={[{ label: "Alimento", value: "ALIMENTO" }, { label: "Bebida", value: "BEBIDA" }]} placeholder="Tipo" />
                <SelectInput selectedValue={loteType} onValueChange={setLoteType} options={[{ label: "Único", value: "UNICO" }, { label: "Múltiplo", value: "MULTIPLO" }]} placeholder="Tipo de Lote" />
            </Row>
            <Row>
                <Input value={loteAmount} onChangeText={setLoteAmount} placeholder="Qtd. por Lote" keyboardType="numeric" />
                <Input value={weight} onChangeText={setWeight} placeholder="Peso (kg, opcional)" keyboardType="decimal-pad" />
            </Row>
            <Input value={quantity} onChangeText={setQuantity} placeholder="Quantidade em Estoque" keyboardType="numeric" />
            <DateInput value={validity} onChange={setValidity} />
            <ShelfPicker shelves={shelves} onSelect={setPosition}>
                <View style={styles.fakeInput}>
                    <Text style={position ? styles.fakeInputText : styles.fakeInputPlaceholder}>
                        {selectedShelf && position ? `Prat. ${selectedShelf.name} | Posição: ${position.row + 1}-${position.column + 1}` : "Posição: (Toque para selecionar)"}
                    </Text>
                    <Ionicons name="grid-outline" size={20} color="#666" />
                </View>
            </ShelfPicker>
            <Button title="SALVAR PRODUTO" onPress={handleSave} loading={isSubmitting} disabled={isSubmitting} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16, backgroundColor: "#F8F9FA" },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingVertical: 16, alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
    fakeInput: { height: 46, borderWidth: 1, borderColor: "#E6E9EE", borderRadius: 8, justifyContent: "space-between", alignItems: 'center', flexDirection: 'row', paddingHorizontal: 12, backgroundColor: "#FFFFFF", marginVertical: 6 },
    fakeInputText: { color: "#111827", fontSize: 14 },
    fakeInputPlaceholder: { color: "#9AA0A6", fontSize: 14 },
});
export default ProductCreateScreen;