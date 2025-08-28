import { Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useStock } from "../../context/StockContext";

export default function StockLayout() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { clearSelectedStock } = useStock();

  const handleLogout = async () => {
    await signOut();
    await clearSelectedStock();
  };

  return (
    <Stack
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
      <Stack.Screen
        name="select"
        options={{
          title: "Meus Estoques",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="form"
        options={{
          title: "Formulário de Estoque",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
