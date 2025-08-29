// app/_layout.tsx - VERSÃO SEGURA PARA PULAR LOGIN E TESTAR TELAS

import "react-native-gesture-handler";
import { AuthProvider } from "@/context/AuthContext";
import { StockProvider } from "@/context/StockContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const router = useRouter();

  useEffect(() => {
    // Força o redirecionamento para a lista de prateleiras para teste
    router.replace("/(product)/shelf");

    // Esconde a tela de splash assim que a navegação for comandada
    SplashScreen.hideAsync();
  }, []);

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