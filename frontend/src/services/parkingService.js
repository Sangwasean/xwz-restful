import api from "./api"

export const parkingService = {
  getParkings: async () => {
    try {
      const response = await api.get('/parking');
      return response.data;
    } catch (error) {
      console.error('Error fetching parking slots:', error);
      throw error;
    }
  },
  getAvailableParking: async () => {
    const response = await api.get("/parking/available")
    return response.data
  },

  getParkingById: async (id) => {
    const response = await api.get(`/parking/${id}`)
    return response.data
  },

  createParking: async (parkingSlotData) => {
    const response = await api.post("/parking", parkingSlotData)
    return response.data
  },

  updateParking: async (id, parkingSlotData) => {
    const response = await api.patch(`/parking/${id}`, parkingSlotData)
    return response.data
  },
}

export default parkingService;