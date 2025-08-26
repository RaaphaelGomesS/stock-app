import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useStock } from "../../context/StockContext";

export default function AppLayout() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { clearSelectedStock } = useStock();

  const handleLogout = async () => {
    await signOut();
    await clearSelectedStock();
  };

  return (
    <Drawer
      screenOptions={{
        headerRight: () => (
          <View style={{ flexDirection: "row", marginRight: 15 }}>
            <TouchableOpacity onPress={() => router.push("/(user)")} style={{ marginRight: 15 }}>
              <Ionicons name="person-circle-outline" size={30} color="#0f172a" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={30} color="#0f172a" />
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Início",
          title: "Início",
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="shelves"
        options={{
          drawerLabel: "Minhas Prateleiras",
          title: "Minhas Prateleiras",
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen name="product" options={{ drawerItemStyle: { display: "none" }, headerShown: false }} />
      <Drawer.Screen name="shelf" options={{ drawerItemStyle: { display: "none" }, headerShown: false }} />
      <Drawer.Screen name="(user)" options={{ drawerItemStyle: { display: "none" }, headerShown: false }} />
    </Drawer>
  );
}
