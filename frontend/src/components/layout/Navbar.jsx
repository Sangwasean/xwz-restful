"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useLogout } from "../../features/auth/hooks/useAuth"

const Navbar = () => {
  const { user } = useAuth()
  const logout = useLogout()

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                ParkEase
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user && (
              <div className="relative ml-3">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-3">
                    {user.firstName} {user.lastName}
                  </span>
                  <button onClick={logout} className="text-sm text-gray-700 hover:text-blue-600">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
