import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import Input from "@/constants/components/Imput/imput";
import Select from "@/constants/components/Select/select";
import Row from "@/constants/components/Row/Row";
import Button from "@/constants/components/Button/Button";
import styles from "@/constants/style/ScreenStyles";

export default function NewProductScreen() {
    const [ean, setEan] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [lotType, setLotType] = useState("");
    const [qtyPerLot, setQtyPerLot] = useState("");
    const [weight, setWeight] = useState("");
    const [stockQty, setStockQty] = useState("");
    const [validity, setValidity] = useState("");
    const [shelf, setShelf] = useState("");
    const [position, setPosition] = useState("");

    const TYPE_OPTIONS = ["GENERICOS", "LIMPEZA", "CONSERVA", "PERECIVEL", "BEBIDAS"];
    const LOT_OPTIONS = ["UNIDADE", "CAIXA", "ENGRADADO", "PACOTE", "FARDO"];

    const onSave = () => {
        if (!name.trim()) {
            Alert.alert("Validação", "O nome do produto é obrigatório.");
            return;
        }

        const productData = {
            ean: ean.trim(),
            name: name.trim(),
            description: description.trim(),
            type,
            lotType,
            qtyPerLot: qtyPerLot ? Number(qtyPerLot) : null,
            weight: weight ? Number(weight) : null,
            stockQty: stockQty ? Number(stockQty) : 0,
            validity: validity.trim(),
            shelf: shelf.trim(),
            position: position.trim(),
        };

        Alert.alert(`Sucesso, produuto cadastrado no seu estoque`);
    };

    const isSaveDisabled = !name.trim();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Novo Produto</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <Input placeholder="EAN (código de barras)" value={ean} onChangeText={setEan} />

                    <Input placeholder="Nome do Produto" value={name} onChangeText={setName} />

                    <Input
                        placeholder="Descrição (Opcional)"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    <Row>
                        <Select
                            selectedValue={type}
                            onValueChange={setType}
                            options={TYPE_OPTIONS}
                            placeholder="Tipo"
                        />
                        <Select
                            selectedValue={lotType}
                            onValueChange={setLotType}
                            options={LOT_OPTIONS}
                            placeholder="Tipo de Lote"
                        />
                    </Row>

                    <Row>
                        <Input
                            placeholder="Qtd. por Lote"
                            keyboardType="numeric"
                            value={qtyPerLot}
                            onChangeText={setQtyPerLot}
                        />
                        <Input
                            placeholder="Peso (kg, opcional)"
                            keyboardType="numeric"
                            value={weight}
                            onChangeText={setWeight}
                        />
                    </Row>

                    <Input
                        placeholder="Quantidade em Estoque"
                        keyboardType="numeric"
                        value={stockQty}
                        onChangeText={setStockQty}
                    />

                    <Input
                        placeholder="Validade (Opcional)"
                        value={validity}
                        onChangeText={setValidity}
                    />

                    <Input
                        placeholder="Selecionar Prateleira"
                        value={shelf}
                        onChangeText={setShelf}
                    />

                    <Row>
                        <Input
                            placeholder="Posição:"
                            value={position}
                            onChangeText={setPosition}
                            style={{ flex: 1 }}
                        />
                        <View style={{ width: 44, height: 46, backgroundColor: "#eee", borderRadius: 8 }} />
                    </Row>

                    <Button title="SALVAR PRODUTO" onPress={onSave} disabled={isSaveDisabled} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
