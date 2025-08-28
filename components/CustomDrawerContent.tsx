import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useStock } from "../context/StockContext";

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { clearSelectedStock } = useStock();

  const handleSwitchStock = async () => {
    props.navigation.closeDrawer();
    await clearSelectedStock();
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <TouchableOpacity onPress={handleSwitchStock} style={styles.stockButton}>
        <Ionicons name="swap-horizontal-outline" size={22} color="#0f172a" />
        <Text style={styles.stockButtonText}>Trocar Estoque</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  stockButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#f1f5f9",
  },
  stockButtonText: {
    fontSize: 15,
    marginLeft: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
});
