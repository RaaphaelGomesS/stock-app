import apiInstance from "./api";
import { Product } from "./ProductService";

export interface Shelf {
  id: number;
  columns: number;
  rows: number;
  destination: string;
  restriction: string | null;
  full: boolean;
  stock_id: number;
  _count?: {
    product: number;
  };
}

export type ShelfLayout = (Product | null)[][];

export const getShelfLayout = async (shelfId: number): Promise<ShelfLayout> => {
  try {
    const response = await apiInstance.get(`/shelf/layout/${shelfId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar layout da prateleira:", error);
    throw error;
  }
};

export const getAllShelvesInStock = async (stockId: number): Promise<Shelf[]> => {
  try {
    const response = await apiInstance.get(`/shelf/stocked/${stockId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar prateleiras do estoque:", error);
    throw error;
  }
};

export const createShelf = async (shelfData: Omit<Shelf, "id" | "_count">) => {
  try {
    const response = await apiInstance.post("/shelf", shelfData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar prateleira:", error);
    throw error;
  }
};

export const updateShelf = async (shelfId: number, shelfData: Partial<Shelf>) => {
  try {
    const response = await apiInstance.put(`/shelf/${shelfId}`, shelfData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar prateleira:", error);
    throw error;
  }
};

export const deleteShelf = async (shelfId: number) => {
  try {
    await apiInstance.delete(`/shelf/${shelfId}`);
  } catch (error) {
    console.error("Erro ao deletar prateleira:", error);
    throw error;
  }
};
