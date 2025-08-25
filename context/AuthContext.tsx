import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { setItem, getItem, removeItem } from "../services/storage";
import { router } from "expo-router";

interface AuthContextData {
  token: string | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function loadStoragedData() {
      const storagedToken = await getItem("userToken");

      if (storagedToken) {
        setToken(storagedToken);

        router.replace("/(stock)/select");
      } else {
        router.replace("/(auth)/login");
      }
    }
    loadStoragedData();
  }, []);

  const signIn = async (newToken: string) => {
    setToken(newToken);
    await setItem("userToken", newToken);
    router.replace("/(stock)/select");
  };

  const signOut = async () => {
    setToken(null);
    await removeItem("userToken");
    router.replace("/(auth)/login");
  };

  return <AuthContext.Provider value={{ token, signIn, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
