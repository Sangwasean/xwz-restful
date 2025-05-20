import { Link } from "react-router-dom"
import { useAllBookings } from "../hooks/useBookings"
import Card from "../../../components/common/atoms/Card"
import Button from "../../../components/common/atoms/Button"
import Badge from "../../../components/common/atoms/Badge"
import Table from "../../../components/common/organisms/Table"
import { TicketIcon, PlusIcon } from "lucide-react"

const BookingListPage = () => {
  const { data: bookings, isLoading } = useAllBookings()

  const getStatusBadge = (status) => {
    const variants = {
      ACTIVE: "success",
      COMPLETED: "primary",
      CANCELLED: "danger",
      OVERSTAY: "warning",
    }

    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  const columns = [
    {
      header: "Parking Slot",
      accessor: "parkingSlot.number",
      cell: (row) => (
        <Link to={`/parking-slots/${row.parkingSlot.id}`} className="text-blue-600 hover:text-blue-800">
          {row.parkingSlot.number}
        </Link>
      ),
    },
    {
      header: "Vehicle",
      accessor: "vehicle.plateNumber",
      cell: (row) => (
        <Link to={`/vehicles/${row.vehicle.id}`} className="text-blue-600 hover:text-blue-800">
          {row.vehicle.plateNumber}
        </Link>
      ),
    },
    {
      header: "Start Time",
      accessor: "startTime",
      cell: (row) => <span>{new Date(row.startTime).toLocaleString()}</span>,
    },
    {
      header: "End Time",
      accessor: "endTime",
      cell: (row) => <span>{new Date(row.endTime).toLocaleString()}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <Link to={`/bookings/${row.id}`}>
            <Button size="sm" variant="secondary">
              View
            </Button>
          </Link>
          {row.status === "ACTIVE" && (
            <Link to={`/bookings/${row.id}`}>
              <Button size="sm">Manage</Button>
            </Link>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Your Bookings</h1>
        <Link to="/bookings/new">
          <Button>
            <PlusIcon className="h-5 w-5 mr-1" />
            New Booking
          </Button>
        </Link>
      </div>

      <Card>
        <Card.Body className="p-0">
          <Table
            columns={columns}
            data={bookings}
            isLoading={isLoading}
            emptyMessage={
              <div className="flex flex-col items-center py-8">
                <TicketIcon className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500">No bookings found</p>
                <Link to="/bookings/new">
                  <Button variant="outline" className="mt-4">
                    Create Your First Booking
                  </Button>
                </Link>
              </div>
            }
          />
        </Card.Body>
      </Card>
    </div>
  )
}

export default BookingListPage
