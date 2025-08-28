import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { setItem, getItem, removeItem } from "../services/storage";

interface AuthContextData {
  token: string | null;
  isLoading: boolean,
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadToken() {
      const storedToken = await getItem("userToken");
      if (storedToken) {
        setToken(storedToken);
      }
      setIsLoading(false);
    }
    loadToken();
  }, []);

  const signIn = async (newToken: string) => {
    await setItem("userToken", newToken);
    setToken(newToken);
  };

  const signOut = async () => {
    await removeItem("userToken");
    setToken(null);
  };

  return <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
