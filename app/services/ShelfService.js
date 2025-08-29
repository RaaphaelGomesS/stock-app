// app/services/ShelfService.ts
// ARQUIVO MODIFICADO PARA USAR DADOS DE TESTE (MOCK)

import apiInstance from "./api";
import { Shelf, ShelfLayout, ShelfItem } from "@/types/shelf";

// =============================================================
// FUNÇÃO MODIFICADA COM MOCK
// =============================================================
export const getAllShelves = async (): Promise<Shelf[]> => {
  console.log("✔️ [MOCK ATIVADO] Retornando lista de prateleiras falsas.");

  const mockShelves: Shelf[] = [
    {
      id: 1,
      name: "Prateleira do Mock A",
      rows: 4,
      columns: 5,
      destinationType: "GERAL",
    },
    {
      id: 2,
      name: "Corredor de Teste B",
      rows: 6,
      columns: 10,
      destinationType: "FRÁGEIS",
      restrictions: "Apenas caixas leves"
    },
  ];

  return new Promise(resolve => setTimeout(() => resolve(mockShelves), 800));
};

// =============================================================
// FUNÇÃO MODIFICADA COM MOCK
// =============================================================
export const getShelfLayout = async (shelfId: number): Promise<ShelfLayout> => {
  console.log(`✔️ [MOCK ATIVADO] Retornando layout falso para a prateleira ID: ${shelfId}.`);

  const mockItems: ShelfItem[] = [
    { productId: 101, name: "Produto A", position: { row: 0, column: 1 } },
    { productId: 102, name: "Produto B", position: { row: 2, column: 3 } },
  ];

  const mockLayout: ShelfLayout = {
    id: shelfId,
    name: "Prateleira do Mock A",
    rows: 4,
    columns: 5,
    destinationType: "GERAL",
    items: mockItems,
  };

  return new Promise(resolve => setTimeout(() => resolve(mockLayout), 600));
};

// =============================================================
// Funções de escrita (criar, atualizar) mantidas para testar a API real
// =============================================================

export const createShelf = async (shelfData: Omit<Shelf, "id">) => {
  try {
    const response = await apiInstance.post("/shelf", shelfData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível criar a prateleira.");
  }
};

// ... (as outras funções de update e delete continuam aqui)
export const updateShelf = async (shelfId: number, shelfData: Partial<Shelf>) => {
 try {
 const response = await apiInstance.put(`/shelf/${shelfId}`, shelfData);
 return response.data;
 } catch (error) {
 throw new Error(error.response?.data?.message || "Não foi possível atualizar a prateleira.");
 }
};
export const deleteShelf = async (shelfId: number) => {
 try {
 const response = await apiInstance.delete(`/shelf/${shelfId}`);
 return response.data;
 } catch (error) {
 throw new Error(error.response?.data?.message || "Não foi possível deletar a prateleira.");
 }
};