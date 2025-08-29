// types/product.ts

export interface Product {
  id: number;
  ean: string;
  name: string;
  description?: string;
  type: string;
  lotType: string;
  quantityPerLot: number;
  weight?: number;
  quantity: number;
  expiryDate?: string;
  shelfId: number;
  shelfPosition: string; // Ex: "A:1, C:2"
}