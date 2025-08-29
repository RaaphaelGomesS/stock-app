// app/context/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { setItem, getItem, removeItem } from "@/services/storage";
import { router } from "expo-router";
import { useStock } from "./StockContext";

// Define o formato do que será compartilhado pelo contexto
interface AuthContextType {
  signIn: (token: string) => Promise<void>;
  signOut: () => void;
  authState: {
    token: string | null;
    authenticated: boolean | null;
  };
}

// Cria o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook customizado para facilitar o uso do contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Componente Provedor que envolve a aplicação
export function AuthProvider({ children }: { children: ReactNode }) {
  const { clearSelectedStock } = useStock();
  const [authState, setAuthState] = useState<{ token: string | null; authenticated: boolean | null }>({
    token: null,
    authenticated: null,
  });

  //=======================================================================//
  // BLOCO DE CÓDIGO TEMPORÁRIO PARA PULAR O LOGIN DURANTE O DESENVOLVIMENTO
  //=======================================================================//
  useEffect(() => {
    const fakeSignInForDev = async () => {
      // IMPORTANTE: Cole aqui um token real obtido após um login bem-sucedido
      // para que as chamadas para a API funcionem corretamente.
      const devToken = "COLE.AQUI.UM.TOKEN.REAL.PARA.TESTES.DE.API"; 
      
      console.log("!!! MODO DESENVOLVIMENTO: LOGIN AUTOMÁTICO ATIVADO !!!");
      
      await setItem("userToken", devToken);
      setAuthState({
        token: devToken,
        authenticated: true,
      });
    };
    
    // Ativa a função de login automático
    fakeSignInForDev(); 
    
  }, []); // O array vazio [] garante que este código rode apenas uma vez quando o app abrir.
  //=======================================================================//
  // FIM DO BLOCO DE CÓDIGO TEMPORÁRIO
  //=======================================================================//


  // Função para fazer o login
  const signIn = async (token: string) => {
    await setItem("userToken", token);
    setAuthState({
      token: token,
      authenticated: true,
    });
    router.replace("/"); // Redireciona para a home após o login
  };

  // Função para fazer o logout
  const signOut = async () => {
    await removeItem("userToken");
    await clearSelectedStock(); // Limpa também o estoque selecionado
    setAuthState({
      token: null,
      authenticated: false,
    });
    router.replace("/(auth)/login"); // Redireciona para o login após o logout
  };

  const value = {
    signIn,
    signOut,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}