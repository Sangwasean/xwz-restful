"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useVehicle, useDeleteVehicle } from "../hooks/useVehicles"
import Card from "../../../components/common/atoms/Card"
import Button from "../../../components/common/atoms/Button"
import LoadingSpinner from "../../../components/common/molecules/LoadingSpinner"
import ConfirmDialog from "../../../components/common/molecules/ConfirmDialog"
import { ArrowLeftIcon, TruckIcon, TrashIcon } from "lucide-react"

const VehicleDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: vehicle, isLoading, error } = useVehicle(id)
  const deleteVehicle = useDeleteVehicle()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteVehicle.mutateAsync(id)
      navigate("/vehicles")
    } catch (error) {
      // Error handling could be added here
      console.error("Failed to delete vehicle:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error loading vehicle details</p>
        <Button variant="secondary" onClick={() => navigate("/vehicles")}>
          Back to Vehicles
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate("/vehicles")} className="mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Vehicles
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Vehicle Details</h1>
      </div>

      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Vehicle Information</h2>
            <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete Vehicle
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <TruckIcon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{vehicle.plateNumber}</h3>
              <p className="text-gray-500 capitalize">{vehicle.type.toLowerCase()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Owner</p>
              <p className="mt-1 text-lg">
                {vehicle.user.firstName} {vehicle.user.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1 text-lg">{vehicle.user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Registered On</p>
              <p className="mt-1 text-sm">{new Date(vehicle.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="mt-1 text-sm">{new Date(vehicle.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="flex justify-end">
            <Button onClick={() => navigate("/bookings/new", { state: { vehicleId: vehicle.id } })}>
              Book Parking with this Vehicle
            </Button>
          </div>
        </Card.Footer>
      </Card>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default VehicleDetailPage
