
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import axios from "axios";

type Product = {
    id: number;
    name: string;
    description: string;
    imageUrl?: string;
    quantity: number;
    type: string;
    loteType: string;
    qtyPerLote: number;
    weight: string;
    validade: string;
    location: string;
};

interface Props {
    route: any;
    navigation: any;
}

const ProductDetails: React.FC<Props> = ({ route }) => {
    const { productId } = route.params;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingQty, setEditingQty] = useState(false);
    const [newQty, setNewQty] = useState("");


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${productId}`);
                setProduct(res.data);
                setNewQty(String(res.data.quantity));
            } catch (err) {
                console.error("Erro ao carregar produto", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleSaveQty = async () => {
        if (!product) return;

        try {
            await axios.put(`${product.id}`, {
                ...product,
                quantity: Number(newQty),
            });

            setProduct({ ...product, quantity: Number(newQty) });
            setEditingQty(false);
        } catch (err) {
            console.error("Erro ao atualizar quantidade", err);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2D6EFF" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.center}>
                <Text>Produto não encontrado</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>

            <View style={styles.imageWrapper}>
                {product.imageUrl ? (
                    <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="contain" />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>Produto</Text>
                    </View>
                )}
            </View>


            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.subtitle}>{product.description}</Text>


            <View style={styles.card}>
                <Text style={styles.cardTitle}>Informações do Produto</Text>


                <View style={styles.row}>
                    <Text style={styles.label}>Quantidade:</Text>
                    {editingQty ? (
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={newQty}
                            onChangeText={setNewQty}
                        />
                    ) : (
                        <Text style={styles.value}>{product.quantity}</Text>
                    )}
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Tipo:</Text>
                    <Text style={styles.value}>{product.type}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Tipo de Lote:</Text>
                    <Text style={styles.value}>{product.loteType}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Qtd. por Lote:</Text>
                    <Text style={styles.value}>{product.qtyPerLote}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Peso:</Text>
                    <Text style={styles.value}>{product.weight}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Validade:</Text>
                    <Text style={styles.value}>{product.validade}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Localização:</Text>
                    <Text style={styles.value}>{product.location}</Text>
                </View>
            </View>


            {editingQty ? (
                <TouchableOpacity style={styles.button} onPress={handleSaveQty}>
                    <Text style={styles.buttonText}>Salvar Quantidade</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.button} onPress={() => setEditingQty(true)}>
                    <Text style={styles.buttonText}>Ajustar Quantidade</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    imageWrapper: {
        width: "100%",
        height: 150,
        borderRadius: 12,
        backgroundColor: "#F0F0F0",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    image: { width: "100%", height: "100%", borderRadius: 12 },
    placeholder: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
        backgroundColor: "#2D6EFF",
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

    title: { fontWeight: "700", fontSize: 18, marginBottom: 6 },
    subtitle: { fontSize: 14, color: "#555", marginBottom: 16 },

    card: {
        borderWidth: 1,
        borderColor: "#E6E9EE",
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
    },
    cardTitle: { fontWeight: "700", fontSize: 15, marginBottom: 12 },
    row: { flexDirection: "row", marginBottom: 8 },
    label: { fontWeight: "600", marginRight: 6, width: 120 },
    value: { color: "#333" },

    input: {
        borderWidth: 1,
        borderColor: "#E6E9EE",
        borderRadius: 6,
        padding: 6,
        width: 100,
    },

    button: {
        backgroundColor: "#2D6EFF",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

export default ProductDetails;