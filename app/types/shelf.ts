// types/shelf.ts

// Define a estrutura de um item de produto em uma posição da prateleira
export interface ShelfItem {
  productId: number;
  name: string;
  position: {
    row: number;
    column: number;
  };
}

// Define a estrutura básica de uma prateleira
export interface Shelf {
  id: number;
  name: string; // Ex: Prateleira A
  rows: number;
  columns: number;
  destinationType?: string;
  restrictions?: string;
}

// Define a estrutura completa do layout da prateleira com os itens
export interface ShelfLayout extends Shelf {
  items: ShelfItem[];
}