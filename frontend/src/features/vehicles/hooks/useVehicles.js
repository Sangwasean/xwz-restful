import { useQuery, useMutation, useQueryClient } from "react-query"
import { vehicleService } from "../../../services/vehicleService"

export const useAllVehicles = () => {
  return useQuery('vehicles', async () => {
    try {
      return await vehicleService.getAllVehicles();
    } catch (error) {
      if (error.response?.status === 401) {
        // Redirect to login if unauthorized
        window.location.href = '/login';
      }
      throw error;
    }
  }, {
    retry: false // Disable automatic retries
  });
};

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
