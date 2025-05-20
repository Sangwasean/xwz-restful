import { useQuery, useMutation, useQueryClient } from "react-query"
import { bookingService } from "../../../services/bookingService"

export const useAllBookings = () => {
  return useQuery(["bookings"], () => bookingService.getAllBookings(), {
    staleTime: 60000, // 1 minute
  })
}

export const useBooking = (id) => {
  return useQuery(["bookings", id], () => bookingService.getBookingById(id), {
    enabled: !!id,
  })
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation((bookingData) => bookingService.createBooking(bookingData), {
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"])
      queryClient.invalidateQueries(["parkingSlots"])
    },
  })
}

export const useExtendBooking = () => {
  const queryClient = useQueryClient()

  return useMutation(({ id, data }) => bookingService.extendBooking(id, data), {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["bookings"])
      queryClient.invalidateQueries(["bookings", variables.id])
    },
  })
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient()

  return useMutation((id) => bookingService.cancelBooking(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"])
      queryClient.invalidateQueries(["parkingSlots"])
    },
  })
}
