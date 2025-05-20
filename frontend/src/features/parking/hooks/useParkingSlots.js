import { useQuery, useMutation, useQueryClient } from "react-query"
import { parkingService } from "../../../services/parkingService"

export const useAllParkingSlots = () => {
  return useQuery(["parkingSlots"], () => parkingService.getAllParkingSlots(), {
    staleTime: 60000, // 1 minute
  })
}

export const useAvailableParkingSlots = () => {
  return useQuery(["parkingSlots", "available"], () => parkingService.getAvailableParkingSlots(), {
    staleTime: 30000, // 30 seconds
  })
}

export const useParkingSlot = (id) => {
  return useQuery(["parkingSlots", id], () => parkingService.getParkingSlotById(id), {
    enabled: !!id,
  })
}

export const useCreateParkingSlot = () => {
  const queryClient = useQueryClient()

  return useMutation((parkingSlotData) => parkingService.createParkingSlot(parkingSlotData), {
    onSuccess: () => {
      queryClient.invalidateQueries(["parkingSlots"])
    },
  })
}

export const useUpdateParkingSlot = () => {
  const queryClient = useQueryClient()

  return useMutation(({ id, data }) => parkingService.updateParkingSlot(id, data), {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["parkingSlots"])
      queryClient.invalidateQueries(["parkingSlots", variables.id])
    },
  })
}
