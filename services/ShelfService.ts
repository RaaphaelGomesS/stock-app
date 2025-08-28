import apiInstance from "./api";
import { Product } from "./ProductService";

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
