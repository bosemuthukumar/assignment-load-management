import apiClient from "./apiClient";

export const authService = {
  register: async (userData, type = "user") => {
    const endpoint = `/auth/${type}/register`;
    const response = await apiClient.post(endpoint, userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials, type = "user") => {
    const endpoint = `/auth/${type}/login`;
    const response = await apiClient.post(endpoint, credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export const loadService = {
  createLoad: async (loadData) => {
    const response = await apiClient.post("/load", loadData);
    return response.data;
  },

  getLoads: async (params = {}) => {
    const response = await apiClient.get("/load", { params });
    return response.data;
  },

  getLoadById: async (id) => {
    const response = await apiClient.get(`/load/${id}`);
    return response.data;
  },

  updateLoad: async (id, loadData) => {
    const response = await apiClient.put(`/load/${id}`, loadData);
    return response.data;
  },

  deleteLoad: async (id) => {
    const response = await apiClient.delete(`/load/${id}`);
    return response.data;
  },
};

export const locationService = {
  getLocationSuggestions: async (query) => {
    const response = await apiClient.get("/location/suggestions", {
      params: { query },
    });
    return response.data;
  },
};
