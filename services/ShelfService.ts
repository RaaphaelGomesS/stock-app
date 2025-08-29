import apiInstance from "./api";
import { Product } from "./ProductService";

export interface Shelf {
  id: number;
  columns: number;
  rows: number;
  destination: string;
  restriction: string | null;
  full: boolean
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
    console.log(stockId);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar prateleiras do estoque:", error);
    throw error;
  }
};
