import apiInstance from "./api";

export const getAllStocks = async () => {
  try {
    const response = await apiInstance.get("/stock");
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível buscar estoques.");
  }
};

export const getStock = async (stockId) => {
  try {
    const response = await apiInstance.get(`/stock/${stockId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível buscar estoque.");
  }
};

export const createStock = async (reqData) => {
  try {
    const response = await apiInstance.post("/stock", reqData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível criar a estoque.");
  }
};

export const updateStock = async (reqData, stockId) => {
  try {
    const response = await apiInstance.put(`/stock/${stockId}`, reqData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível atualizar estoque.");
  }
};

export const deleteStock = async (stockId) => {
  try {
    const response = await apiInstance.delete(`/stock/${stockId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível deletar o estoque.");
  }
};
