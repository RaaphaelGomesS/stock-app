// app/services/ProductService.ts
// ARQUIVO CORRIGIDO PARA USAR DADOS DE TESTE (MOCK)

import apiInstance from "./api";
import { Product } from "@/types/product";

// =============================================================
// FUNÇÃO MODIFICADA COM MOCK
// =============================================================
export const getRecentProducts = async (): Promise<Product[]> => {
  console.log("✔️ [MOCK ATIVADO] Retornando dados falsos para a lista de produtos recentes.");

  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Produto Falso 1 (Caneta)",
      quantity: 150,
      ean: "111111111",
      type: "Papelaria",
      lotType: "Caixa",
      quantityPerLot: 100,
      shelfId: 1,
      // ALTERADO: A estrutura da posição foi ajustada
      position: { row: 0, column: 0 },
      shelfPosition: "Prat. A (L:1, C:1)", // Mantido para exibição, se necessário
    },
    {
      id: 2,
      name: "Item Mock 2 (Caderno)",
      quantity: 80,
      ean: "222222222",
      type: "Papelaria",
      lotType: "Unidade",
      quantityPerLot: 1,
      shelfId: 1,
      description: "Um caderno de teste para o mock",
      expiryDate: "31/12/2025",
      // ALTERADO: A estrutura da posição foi ajustada
      position: { row: 0, column: 1 },
      shelfPosition: "Prat. A (L:1, C:2)",
    },
    {
      id: 3,
      name: "Teste Mock 3 (Borracha)",
      quantity: 300,
      ean: "333333333",
      type: "Material Escritório",
      lotType: "Caixa",
      quantityPerLot: 50,
      shelfId: 2,
      // ALTERADO: A estrutura da posição foi ajustada
      position: { row: 2, column: 4 },
      shelfPosition: "Prat. B (L:3, C:5)",
    },
  ];

  return new Promise(resolve => setTimeout(() => resolve(mockProducts), 1000));
};

// =============================================================
// FUNÇÃO MODIFICADA COM MOCK (BÔNUS)
// =============================================================
export const getProductDetails = async (productId: number): Promise<Product> => {
  console.log(`✔️ [MOCK ATIVADO] Retornando detalhes falsos para o produto ID: ${productId}.`);

  const mockDetailedProduct: Product = {
    id: productId,
    name: "Produto Detalhado Falso",
    description: "Esta é uma descrição mais longa para um produto de teste que vem de um mock para a tela de detalhes.",
    ean: "999888777",
    type: "GENERICO",
    lotType: "CAIXA",
    quantityPerLot: 12,
    weight: 0.25,
    quantity: 50,
    expiryDate: "12/12/2026",
    shelfId: 1,
    // ALTERADO: A estrutura da posição foi ajustada
    position: { row: 0, column: 0 },
    shelfPosition: "Estoque Principal / Prat. A (L:1, C:1)",
  };

  return new Promise(resolve => setTimeout(() => resolve(mockDetailedProduct), 500));
};

// =============================================================
// Funções de escrita (criar, atualizar) mantidas como estavam
// =============================================================

export const createProduct = async (productData: Omit<Product, "id">) => {
  try {
    const response = await apiInstance.post("/product", productData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível criar o produto.");
  }
};

export const updateProduct = async (productId: number, productData: Partial<Product>) => {
  try {
    const response = await apiInstance.put(`/product/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível atualizar o produto.");
  }
};

export const updateProductQuantity = async (productId: number, quantity: number) => {
  try {
    const response = await apiInstance.patch(`/product/${productId}/quantity`, { quantity });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível ajustar a quantidade.");
  }
};

export const deleteProduct = async (productId: number) => {
  try {
    const response = await apiInstance.delete(`/product/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível deletar o produto.");
  }
};