import api from "./api"

export const bookingService = {
  getAllBookings: async () => {
    const response = await api.get("/bookings")
    return response.data
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`)
    return response.data
  },

  createBooking: async (bookingData) => {
    const response = await api.post("/bookings", bookingData)
    return response.data
  },

  extendBooking: async (id, extendData) => {
    const response = await api.patch(`/bookings/${id}`, extendData)
    return response.data
  },

  cancelBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`)
    return response.data
  },
}
