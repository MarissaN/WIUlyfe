import axiosInstance from "./axios";

const api = {
  get: async (url: string, token?: string) => {
    return axiosInstance.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  post: async (url: string, data: any, token?: string) => {
    return axiosInstance.post(url, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  delete: async (url: string, token?: string) => {
    return axiosInstance.delete(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
  addExpense: async (data: any, token?: string) => {
    return api.post("/expense", data, token); 
  }
};

export default api;
