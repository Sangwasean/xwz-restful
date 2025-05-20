"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAllVehicles, useCreateVehicle } from "../hooks/useVehicles"
import Card from "../../../components/common/atoms/Card"
import Button from "../../../components/common/atoms/Button"
import Table from "../../../components/common/organisms/Table"
import FormField from "../../../components/common/molecules/FormField"
import Alert from "../../../components/common/atoms/Alert"
import { TruckIcon, PlusIcon, XIcon } from "lucide-react"

const VehicleListPage = () => {
  const { data: vehicles, isLoading } = useAllVehicles()
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    plateNumber: "",
    type: "",
  })
  const [errors, setErrors] = useState({})

  const createVehicleMutation = useCreateVehicle()

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

    if (!formData.plateNumber) {
      newErrors.plateNumber = "Plate number is required"
    }

    if (!formData.type) {
      newErrors.type = "Vehicle type is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await createVehicleMutation.mutateAsync(formData)
      setFormData({ plateNumber: "", type: "" })
      setShowAddForm(false)
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ general: error.response.data.message || "Failed to add vehicle" })
      } else {
        setErrors({ general: "An error occurred. Please try again." })
      }
    }
  }

  const columns = [
    {
      header: "Plate Number",
      accessor: "plateNumber",
      cell: (row) => (
        <Link to={`/vehicles/${row.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
          {row.plateNumber}
        </Link>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      cell: (row) => <span className="capitalize">{row.type.toLowerCase()}</span>,
    },
    {
      header: "Added On",
      accessor: "createdAt",
      cell: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <Link to={`/vehicles/${row.id}`}>
            <Button size="sm" variant="secondary">
              View
            </Button>
          </Link>
          <Link to="/bookings/new" state={{ vehicleId: row.id }}>
            <Button size="sm">Book Parking</Button>
          </Link>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Your Vehicles</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? (
            <>
              <XIcon className="h-5 w-5 mr-1" />
              Cancel
            </>
          ) : (
            <>
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Vehicle
            </>
          )}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <Card.Header>
            <h2 className="text-lg font-medium">Add New Vehicle</h2>
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
                  label="Plate Number"
                  id="plateNumber"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  error={errors.plateNumber}
                  required
                />

                <FormField
                  label="Vehicle Type"
                  id="type"
                  name="type"
                  type="select"
                  options={[
                    { value: "CAR", label: "Car" },
                    { value: "MOTORCYCLE", label: "Motorcycle" },
                    { value: "TRUCK", label: "Truck" },
                    { value: "VAN", label: "Van" },
                  ]}
                  value={formData.type}
                  onChange={handleChange}
                  error={errors.type}
                  required
                />
              </div>

              <div className="mt-4 flex justify-end">
                <Button type="submit" isLoading={createVehicleMutation.isLoading}>
                  Add Vehicle
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Body className="p-0">
          <Table
            columns={columns}
            data={vehicles}
            isLoading={isLoading}
            emptyMessage={
              <div className="flex flex-col items-center py-8">
                <TruckIcon className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500">No vehicles found</p>
                <Button variant="outline" className="mt-4" onClick={() => setShowAddForm(true)}>
                  Add Your First Vehicle
                </Button>
              </div>
            }
          />
        </Card.Body>
      </Card>
    </div>
  )
}

export default VehicleListPage
