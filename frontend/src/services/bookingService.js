import api from "./api"

export const bookingService = {
  getAllBookings: async () => {
    const response = await api.get("/tickets")
    return response.data
  },

  getBookingById: async (id) => {
    const response = await api.get(`/tickets/${id}`)
    return response.data
  },

  createBooking: async (ticketData) => {
    const response = await api.post("/tickets", ticketData)
    return response.data
  },

  extendBooking: async (id, extendData) => {
    const response = await api.patch(`/tickets/${id}`, extendData)
    return response.data
  },

  cancelBooking: async (id) => {
    const response = await api.delete(`/tickets/${id}`)
    return response.data
  },
}
