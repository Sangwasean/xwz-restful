import { useQuery, useMutation, useQueryClient } from "react-query"
import { parkingService } from "../../../services/parkingService"

export const useAllParkingSlots = () => {
  return useQuery(["parking"], () => parkingService.getParkings(), {
    staleTime: 60000, // 1 minute
  })
}

export const useAvailableParkingSlots = () => {
  return useQuery(["parking", "available"], () => parkingService.getAvailableParkings(), {
    staleTime: 30000, // 30 seconds
  })
}

export const useParkingSlot = (id) => {
  return useQuery(["parking", id], () => parkingService.getParkingById(id), {
    enabled: !!id,
  })
}

export const useCreateParkingSlot = () => {
  const queryClient = useQueryClient()

  return useMutation((parkingSlotData) => parkingService.createParking(parkingSlotData), {
    onSuccess: () => {
      queryClient.invalidateQueries(["parking"])
    },
  })
}

export const useUpdateParkingSlot = () => {
  const queryClient = useQueryClient()

  return useMutation(({ id, data }) => parkingService.updateParking(id, data), {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["parking"])
      queryClient.invalidateQueries(["parking", variables.id])
    },
  })
}
