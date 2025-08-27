// src/components/ImageInput.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from "react-native";
import {
    launchImageLibrary,
    Asset,
    ImageLibraryOptions,
    PhotoQuality
} from "react-native-image-picker";

export type UploadedFile = {
    filename: string;
    path: string;      // uri
    mimetype: string;  // type
    size: number;
};

interface ImageInputProps {
    onChange: (file: UploadedFile | null) => void;
    initialFile?: UploadedFile | null;
    maxWidth?: number;
    maxHeight?: number;
    quality?: PhotoQuality; // 0..1
}

const ImageInput: React.FC<ImageInputProps> = ({
    onChange,
    initialFile = null,
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.8,
}) => {
    const [file, setFile] = useState<UploadedFile | null>(initialFile);
    const [loading, setLoading] = useState(false);

    const handleAsset = (asset: Asset | undefined) => {
        if (!asset || !asset.uri) return;

        const uploaded: UploadedFile = {
            filename: asset.fileName ?? `image_${Date.now()}.jpg`,
            path: asset.uri,
            mimetype: asset.type ?? "image/jpeg",
            size: asset.fileSize ?? 0,
        };
        setFile(uploaded);
        onChange(uploaded);
    };

    const pickFromLibrary = async () => {
        setLoading(true);
        try {
            const options: ImageLibraryOptions = {
                mediaType: "photo",
                maxHeight,
                maxWidth,
                quality,
                selectionLimit: 1,
            };
            const res = await launchImageLibrary(options);
            if (res.didCancel) {
                setLoading(false);
                return;
            }
            handleAsset(res.assets?.[0]);
        } catch (err) {
            Alert.alert("Erro", "Não foi possível abrir a galeria de imagens.");
            console.warn("Erro ao abrir galeria", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.box, file ? styles.boxHasImage : null]}
                onPress={pickFromLibrary}
                activeOpacity={0.8}
            >
                {loading ? (
                    <ActivityIndicator />
                ) : file ? (
                    <Image source={{ uri: file.path }} style={styles.image} />
                ) : (
                    <Text style={styles.addText}>Adicionar Imagem</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginVertical: 8, alignItems: 'center' },
    box: {
        width: "100%",
        height: 160,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E6E9EE",
        backgroundColor: "#F2F4F8",
        justifyContent: "center",
        alignItems: "center",
    },
    boxHasImage: { padding: 0, backgroundColor: "#fff" },
    addText: { color: "#555", fontSize: 15 },
    image: { width: "100%", height: "100%", borderRadius: 10, resizeMode: "cover" },
});

export default ImageInput;