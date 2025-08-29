import axios from "axios";
import { getItem } from "./storage";

const apiInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use(
  async (config) => {
    const token = await getItem("userToken");
    const stockId = await getItem("stockId");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (stockId) {
      config.headers["X-Stock-ID"] = stockId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiInstance;
