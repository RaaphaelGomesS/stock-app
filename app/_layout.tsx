import "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { StockProvider, useStock } from "../context/StockContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from 'react-native';

function RootLayoutNav() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const { stockId, isLoading: isStockLoading } = useStock();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const isLoading = isAuthLoading || isStockLoading;
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inStockGroup = segments[0] === "(user)";
    const inAppGroup = segments[0] === "(tabs)";

    if (token) {
      if (stockId) {
        if (!inAppGroup) {
          router.replace('/');
        }
      } else {
        if (!inStockGroup) {
          router.replace('/select');
        }
      }
    } else {
      if (!inAuthGroup) {
        router.replace('/login');
      }
    }
  }, [token, stockId, segments, isAuthLoading, isStockLoading]);

  if (isAuthLoading || isStockLoading) {
      return <ActivityIndicator style={{flex: 1}} size="large" />;
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
