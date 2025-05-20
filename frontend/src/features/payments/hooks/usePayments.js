import { useQuery, useMutation, useQueryClient } from "react-query"
import { paymentService } from "../../../services/paymentService"

export const useAllPayments = () => {
  return useQuery(["payments"], () => paymentService.getAllPayments(), {
    staleTime: 60000, // 1 minute
  })
}

export const useProcessPayment = () => {
  const queryClient = useQueryClient()

  return useMutation((paymentData) => paymentService.processPayment(paymentData), {
    onSuccess: () => {
      queryClient.invalidateQueries(["payments"])
      queryClient.invalidateQueries(["bookings"])
    },
  })
}
