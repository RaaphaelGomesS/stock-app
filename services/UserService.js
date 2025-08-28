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
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível realizar o login.");
  }
};

export const getUser = async () => {
  try {
    const response = await apiInstance.get("/user");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível consultar as informações do usuário.");
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await apiInstance.put(`/user/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível atualizar o usuário.");
  }
};

export const deleteUser = async (userId) => {
  try {
    await apiInstance.delete(`/user/${userId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || "Não foi possível deletar o usuário.");
  }
};
