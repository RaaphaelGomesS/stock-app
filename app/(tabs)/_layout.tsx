import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useStock } from "../../context/StockContext";
import CustomDrawerContent from "@/components/CustomDrawerContent";

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
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "white",
        },
        headerShadowVisible: true,
        headerTintColor: "#0f172a",
        headerTitleStyle: {
          fontWeight: "bold",
        },
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
        name="shelf"
        options={{
          drawerLabel: "Prateleiras",
          title: "Prateleiras",
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen name="product" options={{ drawerItemStyle: { display: "none" }, headerShown: false }} />
      <Drawer.Screen name="(user)" options={{ drawerItemStyle: { display: "none" }, headerShown: false }} />
    </Drawer>
  );
}
