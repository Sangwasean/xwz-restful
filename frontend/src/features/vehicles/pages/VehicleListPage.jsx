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
import { vehicleService } from "../../../services/vehicleService"

const VehicleListPage = () => {
  const { data: vehicles, isLoading, refetch } = useAllVehicles();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ plateNumber: "" });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const createVehicleMutation = useCreateVehicle()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.plateNumber) {
      newErrors.plateNumber = "Plate number is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddVehicle = async () => {
    if (!validateForm()) return

    try {
      await vehicleService.createVehicle(formData);
      setFormData({ plateNumber: "" });
      setShowAddForm(false);
      setSuccessMessage("Vehicle successfully created!");
      refetch();
      setTimeout(() => setSuccessMessage(""), 3000); // Auto-hide after 3 seconds
    } catch (error) {
      setErrors({
        general: error.message || "Failed to add vehicle"
      });
    }
  };

  const columns = [
  {
    header: "Plate Number",
    accessor: "plateNumber",
    cell: (value, row) => (
      <Link to={`/vehicles/${row.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
        {value}
      </Link>
    ),
  },
  {
    header: "Added On",
    accessor: "createdAt",
    cell: (value) => (
      <span>{new Date(value).toLocaleDateString()}</span>
    ),
  },
  {
    header: "Actions",
    cell: (_, row) => (
      <div className="flex space-x-2">
        {/* Add any action buttons here */}
      </div>
    ),
  },
];


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Your Vehicles</h1>
        <Button onClick={() => setShowAddForm((prev) => !prev)}>
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

      {successMessage && (
        <Alert variant="success" className="mb-4">
          {successMessage}
        </Alert>
      )}

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

            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddVehicle();
            }}>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  label="Plate Number"
                  id="plateNumber"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  error={errors.plateNumber}
                  required
                />
              </div>

              <div className="mt-4 flex justify-end">
                <Button type="submit">
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
