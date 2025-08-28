import apiInstance from "./api";

export interface Product {
  id: number;
  name: string;
  quantity: number;
  shelf_id: number;
  description?: string;
  type?: string;
  lote_type?: string;
  weight?: number;
  lote_amount?: number;
  validity?: string;
  column?: number;
  row?: number;
  image?: string;
}

export interface ProductTemplate {
  ean: number;
  name: string;
  description: string | null;
  type: string;
  loteType: string;
  weight: number | null;
  loteAmount: number;
  image: string | null;
}

export const getProductHistory = async (): Promise<Product[]> => {
  try {
    const response = await apiInstance.get("/product/history");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar histórico de produtos:", error);
    throw error;
  }
};

export const searchProductsByName = async (name: string): Promise<Product[]> => {
  try {
    const response = await apiInstance.get(`/product/search`, {
      params: { q: name },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos por nome:", error);
    throw error;
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await apiInstance.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produto por ID:", error);
    throw error;
  }
};

export const searchTemplatesByName = async (name: string): Promise<ProductTemplate[]> => {
  try {
    const response = await apiInstance.get(`/product/template/search`, {
      params: { q: name },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar templates por nome:", error);
    throw error;
  }
};

export const searchProductsByEan = async (ean: string): Promise<Product[]> => {
  try {
    const response = await apiInstance.get(`/product/ean/${ean}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos por EAN:", error);
    throw error;
  }
};

export const getTemplateByEan = async (ean: string): Promise<ProductTemplate> => {
  try {
    const response = await apiInstance.get(`/product/template/${ean}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar template por EAN:", error);
    throw error;
  }
};

export const createProduct = async (productData: any, image: any | null): Promise<Product> => {
  const formData = new FormData();

  Object.keys(productData).forEach((key) => {
    formData.append(key, productData[key]);
  });

  if (image) {
    const uriParts = image.uri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    const imageData = {
      uri: image.uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    };

    formData.append("productImage", imageData as any);
  }

  try {
    const response = await apiInstance.post("/product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    throw error;
  }
};
