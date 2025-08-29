import apiInstance from "./api";

export const register = async (reqData) => {
  try {
    const response = await apiInstance.post("/register", reqData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível criar a conta.");
  }
};

export const login = async (reqData) => {
  try {
    const response = await apiInstance.post("/login", reqData);
    console.log("TOKEN DE ACESSO:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível realizar o login.");
  }
};
