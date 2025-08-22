import apiInstance from "./api.js";

export const register = async (reqData) => {
    try {
       const response = await apiInstance.post("/register", reqData);
       return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Não foi possível criar a conta.');
    }
};

export const login = async (reqData) => {
    try {
       const response = await apiInstance.post("/login", reqData);
       return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Não foi possível realizar o login.');
    }
};