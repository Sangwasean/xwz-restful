import { Link } from "react-router-dom"
import { useAllParkingSlots } from "../../parking/hooks/useParkingSlots"
import { useAllBookings } from "../../bookings/hooks/useBookings"
import { useAllVehicles } from "../../vehicles/hooks/useVehicles"
import Card from "../../../components/common/atoms/Card"
import LoadingSpinner from "../../../components/common/molecules/LoadingSpinner"
import { ParkingCircleIcon, TruckIcon, TicketIcon, CreditCardIcon } from "lucide-react"

const DashboardPage = () => {
  const { data: parkingSlots, isLoading: parkingSlotsLoading } = useAllParkingSlots()
  const { data: bookings, isLoading: bookingsLoading } = useAllBookings()
  const { data: vehicles, isLoading: vehiclesLoading } = useAllVehicles()

  const isLoading = parkingSlotsLoading || bookingsLoading || vehiclesLoading

  const stats = [
    {
      title: "Available Parking Slots",
      value: parkingSlots ? parkingSlots.filter((slot) => slot.isAvailable).length : 0,
      total: parkingSlots ? parkingSlots.length : 0,
      icon: ParkingCircleIcon,
      color: "bg-blue-500",
      link: "/parking-slots",
    },
    {
      title: "Your Vehicles",
      value: vehicles ? vehicles.length : 0,
      icon: TruckIcon,
      color: "bg-green-500",
      link: "/vehicles",
    },
    {
      title: "Active Bookings",
      value: bookings ? bookings.filter((booking) => booking.status === "ACTIVE").length : 0,
      icon: TicketIcon,
      color: "bg-yellow-500",
      link: "/bookings",
    },
    {
      title: "Payments",
      value: bookings ? bookings.filter((booking) => booking.status === "COMPLETED").length : 0,
      icon: CreditCardIcon,
      color: "bg-purple-500",
      link: "/payments",
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      {isLoading ? (
        <LoadingSpinner className="h-40" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => (
              <Link key={index} to={stat.link}>
                <Card className="hover:shadow-lg transition-shadow">
                  <Card.Body className="flex items-center">
                    <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                        {stat.total && <span className="text-sm text-gray-500"> / {stat.total}</span>}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <Card.Header>
                <h2 className="text-lg font-medium">Recent Bookings</h2>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="divide-y divide-gray-200">
                  {bookings && bookings.length > 0 ? (
                    bookings.slice(0, 5).map((booking) => (
                      <Link key={booking.id} to={`/bookings/${booking.id}`} className="block hover:bg-gray-50">
                        <div className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Slot {booking.parkingSlot.number}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(booking.startTime).toLocaleString()} -{" "}
                                {new Date(booking.endTime).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  booking.status === "ACTIVE"
                                    ? "bg-green-100 text-green-800"
                                    : booking.status === "COMPLETED"
                                      ? "bg-blue-100 text-blue-800"
                                      : booking.status === "CANCELLED"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-6 py-4 text-center text-gray-500">No bookings found</div>
                  )}
                </div>
              </Card.Body>
              <Card.Footer>
                <Link to="/bookings" className="text-sm text-blue-600 hover:text-blue-500">
                  View all bookings
                </Link>
              </Card.Footer>
            </Card>

            <Card>
              <Card.Header>
                <h2 className="text-lg font-medium">Your Vehicles</h2>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="divide-y divide-gray-200">
                  {vehicles && vehicles.length > 0 ? (
                    vehicles.slice(0, 5).map((vehicle) => (
                      <Link key={vehicle.id} to={`/vehicles/${vehicle.id}`} className="block hover:bg-gray-50">
                        <div className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <TruckIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{vehicle.plateNumber}</p>
                              <p className="text-sm text-gray-500">{vehicle.type}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-6 py-4 text-center text-gray-500">No vehicles found</div>
                  )}
                </div>
              </Card.Body>
              <Card.Footer>
                <Link to="/vehicles" className="text-sm text-blue-600 hover:text-blue-500">
                  View all vehicles
                </Link>
              </Card.Footer>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage
