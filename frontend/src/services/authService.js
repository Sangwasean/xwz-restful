import api from "./api"

export const authService = {
  login: async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    console.log("Login response:", response.data); // Debug log
    
    if (response.data?.token && response.data?.user) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log("User stored:", response.data.user); // Debug log
    } else {
      console.error("Missing token or user in response");
    }
    
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
},
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData)
      return response.data
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    }
  },

  logout: () => {
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("user");
      if (user === null || user === 'undefined') {
        return null;
      }
      return JSON.parse(user);
    } catch (error) {
      console.error("Failed to parse user data, clearing storage:", error);
      localStorage.removeItem("user");
      return null;
    }
  },

  isAuthenticated: () => {
    try {
      const token = localStorage.getItem("token");
      return !!token && token !== 'undefined';
    } catch (error) {
      return false;
    }
  },

  // Optional: Add token getter
  getToken: () => {
    try {
      return localStorage.getItem("token")
    } catch (error) {
      console.error("Failed to get token:", error)
      return null
    }
  }
}