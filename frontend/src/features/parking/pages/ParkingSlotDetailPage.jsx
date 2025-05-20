"use client"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useParkingSlot, useUpdateParkingSlot } from "../hooks/useParkingSlots"
import Card from "../../../components/common/atoms/Card"
import Button from "../../../components/common/atoms/Button"
import Badge from "../../../components/common/atoms/Badge"
import LoadingSpinner from "../../../components/common/molecules/LoadingSpinner"
import { useAuth } from "../../../contexts/AuthContext"
import { ArrowLeftIcon, ParkingCircleIcon } from "lucide-react"

const ParkingSlotDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: parkingSlot, isLoading, error } = useParkingSlot(id)
  const updateParkingSlot = useUpdateParkingSlot()

  const handleToggleAvailability = () => {
    updateParkingSlot.mutate(
      {
        id,
        data: { isAvailable: !parkingSlot.isAvailable },
      },
      {
        onSuccess: () => {
          // Success notification could be added here
        },
      },
    )
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
        <p className="text-red-500 mb-4">Error loading parking slot details</p>
        <Button variant="secondary" onClick={() => navigate("/parking-slots")}>
          Back to Parking Slots
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/parking-slots")}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Parking Slots
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Parking Slot Details</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Card.Header>
            <h2 className="text-lg font-medium">Slot Information</h2>
          </Card.Header>
          <Card.Body>
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <ParkingCircleIcon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{parkingSlot.number}</h3>
                <Badge variant={parkingSlot.isAvailable ? "success" : "danger"}>
                  {parkingSlot.isAvailable ? "Available" : "Occupied"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Floor</p>
                <p className="mt-1 text-lg">{parkingSlot.floor}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p className="mt-1 text-lg capitalize">{parkingSlot.type.toLowerCase()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p className="mt-1 text-sm">{new Date(parkingSlot.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="mt-1 text-sm">{new Date(parkingSlot.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </Card.Body>
          <Card.Footer>
            <div className="flex justify-between">
              {user && user.role === "ADMIN" && (
                <Button
                  variant={parkingSlot.isAvailable ? "danger" : "success"}
                  onClick={handleToggleAvailability}
                  isLoading={updateParkingSlot.isLoading}
                >
                  Mark as {parkingSlot.isAvailable ? "Occupied" : "Available"}
                </Button>
              )}

              {parkingSlot.isAvailable && (
                <Link to="/bookings/new" state={{ parkingSlotId: parkingSlot.id }}>
                  <Button>Book This Slot</Button>
                </Link>
              )}
            </div>
          </Card.Footer>
        </Card>

        <Card>
          <Card.Header>
            <h2 className="text-lg font-medium">Location</h2>
          </Card.Header>
          <Card.Body>
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-md mb-4">
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Slot map placeholder</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Floor {parkingSlot.floor}, Slot {parkingSlot.number}
            </p>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default ParkingSlotDetailPage
