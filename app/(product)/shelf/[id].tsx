// app/(product)/shelf/[id].tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getShelfLayout } from "@/services/ShelfService";
import { setItem } from "@/services/storage"; // Importado aqui
import { ShelfLayout, ShelfItem } from "@/types/shelf";

export default function ShelfGridScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const shelfId = Number(params.id);
  const mode = params.mode as "select" | "view";

  const [shelfLayout, setShelfLayout] = useState<ShelfLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (shelfId) {
      fetchShelfDetails();
    }
  }, [shelfId]);

  useEffect(() => {
    if (shelfLayout) {
      navigation.setOptions({
        title: shelfLayout.name,
      });
    }
  }, [shelfLayout]);

  const fetchShelfDetails = async () => {
    try {
      setIsLoading(true);
      const data = await getShelfLayout(shelfId);
      setShelfLayout(data);
    } catch (error) {
      let errorMessage = "Não foi possível carregar a prateleira.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert("Erro", errorMessage, [{ text: "OK", onPress: () => router.back() }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Função agora é async para poder usar 'await'
  const handleSlotPress = async (row: number, col: number, item?: ShelfItem) => {
    if (mode === 'select') {
      if (item) {
        Alert.alert("Local Ocupado", "Por favor, selecione um local vazio.");
        return;
      }
      
      // LÓGICA DE COMUNICAÇÃO ATUALIZADA
      if (shelfLayout) {
        const positionData = {
          shelfId: shelfLayout.id,
          shelfName: shelfLayout.name,
          row: row,
          column: col,
        };
        
        await setItem("selectedPosition", JSON.stringify(positionData));
        
        if (router.canGoBack()) {
          router.back();
        }
      }
    } else {
      if (item) {
        router.push(`/(product)/details/${item.productId}` as any);
      }
    }
  };

  const renderGrid = () => {
    if (!shelfLayout) return null;

    const grid: (ShelfItem | null)[][] = Array(shelfLayout.rows)
      .fill(null)
      .map(() => Array(shelfLayout.columns).fill(null));

    shelfLayout.items.forEach((item) => {
      const { row, column } = item.position;
      if (row < shelfLayout.rows && column < shelfLayout.columns) {
        grid[row][column] = item;
      }
    });

    return grid.map((rowItems, rowIndex) => (
      <View key={`row-${rowIndex}`} style={styles.gridRow}>
        {rowItems.map((item, colIndex) => {
          const isOccupied = !!item;
          const isDisabled = mode === 'select' && isOccupied;

          return (
            <TouchableOpacity
              key={`slot-${rowIndex}-${colIndex}`}
              style={[
                styles.slot,
                isOccupied ? styles.occupiedSlot : styles.emptySlot,
                isDisabled && styles.disabledSlot,
              ]}
              onPress={() => handleSlotPress(rowIndex, colIndex, item || undefined)}
              disabled={isDisabled}
            >
              {isOccupied ? (
                <>
                  <Text style={styles.slotTextBold}>{item?.name.split(' ')[0]}</Text>
                  <Text style={styles.slotText}>{item?.name.split(' ').slice(1).join(' ')}</Text>
                </>
              ) : (
                <Text style={styles.emptyText}>Vazio</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    ));
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderGrid()}
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos (sem alterações)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContainer: { padding: 16 },
  gridRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  slot: { flex: 1, aspectRatio: 1, margin: 5, borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 4 },
  emptySlot: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  occupiedSlot: { backgroundColor: '#eff6ff', borderColor: '#60a5fa' },
  disabledSlot: { opacity: 0.4 },
  slotText: { fontSize: 11, color: '#1e3a8a', textAlign: 'center' },
  slotTextBold: { fontSize: 12, color: '#1e3a8a', textAlign: 'center', fontWeight: 'bold' },
  emptyText: { fontSize: 12, color: '#94a3b8' },
});