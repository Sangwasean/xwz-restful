"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAvailableParkingSlots } from "../../parking/hooks/useParkingSlots"
import { useAllVehicles } from "../../vehicles/hooks/useVehicles"
import { useCreateBooking } from "../hooks/useBookings"
import Card from "../../../components/common/atoms/Card"
import Button from "../../../components/common/atoms/Button"
import FormField from "../../../components/common/molecules/FormField"
import Alert from "../../../components/common/atoms/Alert"
import LoadingSpinner from "../../../components/common/molecules/LoadingSpinner"
import { ArrowLeftIcon } from "lucide-react"

const CreateBookingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: parkingSlots, isLoading: parkingSlotsLoading } = useAvailableParkingSlots()
  const { data: vehicles, isLoading: vehiclesLoading } = useAllVehicles()

  const initialState = {
    parkingSlotId: location.state?.parkingSlotId || "",
    vehicleId: location.state?.vehicleId || "",
    startTime: new Date(new Date().getTime() + 30 * 60000).toISOString().slice(0, 16), // 30 minutes from now
    durationHours: 1,
  }

  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})

  const createBookingMutation = useCreateBooking()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.parkingSlotId) {
      newErrors.parkingSlotId = "Please select a parking slot"
    }

    if (!formData.vehicleId) {
      newErrors.vehicleId = "Please select a vehicle"
    }

    if (!formData.startTime) {
      newErrors.startTime = "Please select a start time"
    } else {
      const selectedTime = new Date(formData.startTime)
      const now = new Date()
      if (selectedTime < now) {
        newErrors.startTime = "Start time must be in the future"
      }
    }

    if (!formData.durationHours || formData.durationHours < 1) {
      newErrors.durationHours = "Duration must be at least 1 hour"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await createBookingMutation.mutateAsync(formData)
      navigate("/bookings")
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ general: error.response.data.message || "Failed to create booking" })
      } else {
        setErrors({ general: "An error occurred. Please try again." })
      }
    }
  }

  const isLoading = parkingSlotsLoading || vehiclesLoading

  // Check if user has no vehicles
  const noVehicles = !vehiclesLoading && (!vehicles || vehicles.length === 0)

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate("/bookings")} className="mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Bookings
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Create New Booking</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : noVehicles ? (
        <Card>
          <Card.Body className="text-center py-8">
            <p className="text-gray-500 mb-4">You need to register a vehicle before creating a booking.</p>
            <Button onClick={() => navigate("/vehicles")}>Register a Vehicle</Button>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Header>
            <h2 className="text-lg font-medium">Booking Details</h2>
          </Card.Header>
          <Card.Body>
            {errors.general && (
              <Alert variant="error" className="mb-4">
                {errors.general}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="Parking Slot"
                  id="parkingSlotId"
                  name="parkingSlotId"
                  type="select"
                  options={
                    parkingSlots
                      ? parkingSlots.map((slot) => ({
                          value: slot.id,
                          label: `${slot.number} (Floor ${slot.floor}, ${slot.type})`,
                        }))
                      : []
                  }
                  value={formData.parkingSlotId}
                  onChange={handleChange}
                  error={errors.parkingSlotId}
                  required
                />

                <FormField
                  label="Vehicle"
                  id="vehicleId"
                  name="vehicleId"
                  type="select"
                  options={
                    vehicles
                      ? vehicles.map((vehicle) => ({
                          value: vehicle.id,
                          label: `${vehicle.plateNumber} (${vehicle.type})`,
                        }))
                      : []
                  }
                  value={formData.vehicleId}
                  onChange={handleChange}
                  error={errors.vehicleId}
                  required
                />

                <FormField
                  label="Start Time"
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleChange}
                  error={errors.startTime}
                  required
                />

                <FormField
                  label="Duration (hours)"
                  id="durationHours"
                  name="durationHours"
                  type="number"
                  min="1"
                  value={formData.durationHours}
                  onChange={handleChange}
                  error={errors.durationHours}
                  required
                />
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="button" variant="secondary" className="mr-2" onClick={() => navigate("/bookings")}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={createBookingMutation.isLoading}>
                  Create Booking
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}

export default CreateBookingPage
