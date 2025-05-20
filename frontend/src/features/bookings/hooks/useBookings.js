import { useQuery, useMutation, useQueryClient } from "react-query"
import { bookingService } from "../../../services/bookingService"

export const useAllBookings = () => {
  return useQuery(["tickets"], () => bookingService.getAllBookings(), {
    staleTime: 60000, // 1 minute
  })
}

export const useBooking = (id) => {
  return useQuery(["tickets", id], () => bookingService.getBookingById(id), {
    enabled: !!id,
  })
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation((bookingData) => bookingService.createBooking(bookingData), {
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"])
      queryClient.invalidateQueries(["parking"])
    },
  })
}

export const useExtendBooking = () => {
  const queryClient = useQueryClient()

  return useMutation(({ id, data }) => bookingService.extendBooking(id, data), {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["tickets"])
      queryClient.invalidateQueries(["tickets", variables.id])
    },
  })
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient()

  return useMutation((id) => bookingService.cancelBooking(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"])
      queryClient.invalidateQueries(["parking"])
    },
  })
}
