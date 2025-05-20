import api from "./api";

export const vehicleService = {
  getAllVehicles: async () => {
    try {
      const response = await api.get("/vehicles", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        timeout: 10000 // 10 second timeout
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      throw error;
    }
  },

  getVehicleById: async (id) => {
    try {
      const response = await api.get(`/vehicles/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching vehicle ${id}:`, error);
      throw error;
    }
  },

  createVehicle: async (vehicleData) => {
    try {
      const response = await api.post("/vehicles", vehicleData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error creating vehicle:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  deleteVehicle: async (id) => {
    try {
      const response = await api.delete(`/vehicles/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting vehicle ${id}:`, error);
      if (error.response?.status === 403) {
        throw new Error("You don't have permission to delete this vehicle");
      }
      throw error;
    }
  },

  // Optional: Add a method to check if backend is reachable
  checkAPIHealth: async () => {
    try {
      await api.get("/health", { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
};