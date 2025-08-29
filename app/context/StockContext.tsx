import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { setItem, getItem, removeItem } from "@/services/storage";

interface AuthContextData {
  stockId: number | null;
  selectStock: (stockId: number) => Promise<void>;
  clearSelectedStock: () => Promise<void>;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const StockContext = createContext<AuthContextData>({} as AuthContextData);

export const StockProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [stockId, setStockId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStock = async () => {
      const storedId = await getItem("stockId");
      if (storedId) {
        setStockId(parseInt(storedId, 10));
      }
      setIsLoading(false);
    };
    loadStock();
  }, []);

  const selectStock = async (id: number | null) => {
    if (id) {
      await setItem("stockId", id.toString());
      setStockId(id);
    } else {
      await removeItem("stockId");
      setStockId(null);
    }
  };

  const clearSelectedStock = async () => {
    await removeItem("stockId");
    setStockId(null);
  };

  return <StockContext.Provider value={{ stockId, selectStock, clearSelectedStock, isLoading  }}>{children}</StockContext.Provider>;
};

export const useStock = () => {
  return useContext(StockContext);
};
