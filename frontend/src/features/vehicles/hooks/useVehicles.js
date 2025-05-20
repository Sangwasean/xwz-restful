import { useQuery, useMutation, useQueryClient } from "react-query"
import { vehicleService } from "../../../services/vehicleService"

export const useAllVehicles = () => {
  return useQuery(["vehicles"], () => vehicleService.getAllVehicles(), {
    staleTime: 60000, // 1 minute
  })
}

export const useVehicle = (id) => {
  return useQuery(["vehicles", id], () => vehicleService.getVehicleById(id), {
    enabled: !!id,
  })
}

export const useCreateVehicle = () => {
  const queryClient = useQueryClient()

  return useMutation((vehicleData) => vehicleService.createVehicle(vehicleData), {
    onSuccess: () => {
      queryClient.invalidateQueries(["vehicles"])
    },
  })
}

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient()

  return useMutation((id) => vehicleService.deleteVehicle(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["vehicles"])
    },
  })
}
