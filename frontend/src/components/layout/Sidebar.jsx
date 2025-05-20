import { NavLink } from "react-router-dom"
import { HomeIcon, TicketIcon, TruckIcon, CreditCardIcon, ParkingCircleIcon } from "lucide-react"

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/", icon: HomeIcon },
    { name: "Parking Slots", path: "/parking-slots", icon: ParkingCircleIcon },
    { name: "Vehicles", path: "/vehicles", icon: TruckIcon },
    { name: "Bookings", path: "/bookings", icon: TicketIcon },
    { name: "Payments", path: "/payments", icon: CreditCardIcon },
  ]

  return (
    <div className="h-full bg-gray-800 w-64 flex-shrink-0">
      <div className="h-16 flex items-center justify-center">
        <h2 className="text-white text-xl font-semibold">Parking System</h2>
      </div>
      <nav className="mt-5 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1 ${
                isActive ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
            end={item.path === "/"}
          >
            <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
