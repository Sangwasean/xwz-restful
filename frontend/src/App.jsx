import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./components/common/molecules/ProtectedRoute"
import LoginPage from "./features/auth/pages/LoginPage"
import RegisterPage from "./features/auth/pages/RegisterPage"
import DashboardPage from "./features/dashboard/pages/DashboardPage"
import ParkingSlotListPage from "./features/parking/pages/ParkingSlotListPage"
import ParkingSlotDetailPage from "./features/parking/pages/ParkingSlotDetailPage"
import VehicleListPage from "./features/vehicles/pages/VehicleListPage"
import VehicleDetailPage from "./features/vehicles/pages/VehicleDetailPage"
import BookingListPage from "./features/bookings/pages/BookingListPage"
import BookingDetailPage from "./features/bookings/pages/BookingDetailPage"
import CreateBookingPage from "./features/bookings/pages/CreateBookingPage"
import PaymentListPage from "./features/payments/pages/PaymentListPage"
import Layout from "./components/layout/Layout"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="parking-slots">
                <Route index element={<ParkingSlotListPage />} />
                <Route path=":id" element={<ParkingSlotDetailPage />} />
              </Route>
              <Route path="vehicles">
                <Route index element={<VehicleListPage />} />
                <Route path=":id" element={<VehicleDetailPage />} />
              </Route>
              <Route path="bookings">
                <Route index element={<BookingListPage />} />
                <Route path="new" element={<CreateBookingPage />} />
                <Route path=":id" element={<BookingDetailPage />} />
              </Route>
              <Route path="payments" element={<PaymentListPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
