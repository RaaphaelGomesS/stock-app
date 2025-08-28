import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

interface BarcodeScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onBarcodeScanned: (data: string) => void;
}

export default function BarcodeScannerModal({ visible, onClose, onBarcodeScanned }: BarcodeScannerModalProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    if (visible) {
      getCameraPermissions();
      setScanned(false);
    }
  }, [visible]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      onBarcodeScanned(data);
    }
  };

  if (hasPermission === false) {
    Alert.alert(
      "Sem acesso à câmera",
      "Você precisa conceder permissão de câmera nas configurações do seu dispositivo para usar esta funcionalidade.",
      [{ text: "OK", onPress: onClose }]
    );
    return null;
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <CameraView
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Aponte a câmera para o código de barras</Text>
          <View style={styles.scanArea} />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 30,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 5,
  },
  scanArea: {
    width: 280,
    height: 180,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
  },
});
