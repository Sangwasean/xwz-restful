import api from "./api"

export const paymentService = {
  getAllPayments: async () => {
    const response = await api.get("/payments")
    return response.data
  },

  processPayment: async (paymentData) => {
    const response = await api.post("/payments", paymentData)
    return response.data
  },
}
