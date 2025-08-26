import "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { StockProvider, useStock } from "../context/StockContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function RootLayoutNav() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const { stockId, isLoading: isStockLoading } = useStock();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const isLoading = isAuthLoading || isStockLoading;
    if (isLoading) return;

    const inGroup = segments[0];

    if (!token && inGroup !== "(auth)") {
      router.replace("/login");
    } else if (token && !stockId && inGroup !== "(stock)") {
      router.replace("/select");
    } else if (token && stockId && inGroup !== "(tabs)") {
      router.replace("/");
    }
  }, [token, stockId, segments, isAuthLoading, isStockLoading]);

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
