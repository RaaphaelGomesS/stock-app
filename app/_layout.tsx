import "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { StockProvider, useStock } from "../context/StockContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function RootLayoutNav() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const { stockId, isLoading: isStockLoading } = useStock();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const isLoading = isAuthLoading || isStockLoading;
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inStockGroup = segments[0] === "(stock)";
    const inAppGroup = segments[0] === "(tabs)";
    const inUserGroup = segments[0] === "(user)";
    const inProductGroup = segments[0] === "(product)";
    const inShelfGroup = segments[0] === "(shelf)";

    if (!token) {
      if (!inAuthGroup) {
        router.replace("/login");
      }
      return;
    }
    if (!stockId) {
      if (!inStockGroup && !inUserGroup) {
        router.replace("/(stock)/select");
      }
      return;
    }

    if (stockId) {
      if (!inAppGroup && !inUserGroup && !inProductGroup && !inShelfGroup) {
        router.replace("/");
      }
      return;
    }
  }, [token, stockId, segments, isAuthLoading, isStockLoading]);

  if (isAuthLoading || isStockLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StockProvider>
        <RootLayoutNav />
      </StockProvider>
    </AuthProvider>
  );
}
