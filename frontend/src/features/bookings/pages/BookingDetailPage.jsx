"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useBooking, useExtendBooking, useCancelBooking } from "../hooks/useBookings"
import { useProcessPayment } from "../../payments/hooks/usePayments"
import Card from "../../../components/common/atoms/Card"
import Button from "../../../components/common/atoms/Button"
import Badge from "../../../components/common/atoms/Badge"
import FormField from "../../../components/common/molecules/FormField"
import LoadingSpinner from "../../../components/common/molecules/LoadingSpinner"
import ConfirmDialog from "../../../components/common/molecules/ConfirmDialog"
import Alert from "../../../components/common/atoms/Alert"
import { ArrowLeftIcon, TicketIcon, ClockIcon, BanknoteIcon } from "lucide-react"

const BookingDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: booking, isLoading, error } = useBooking(id)

  const [showExtendForm, setShowExtendForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const [extendHours, setExtendHours] = useState(1)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [formErrors, setFormErrors] = useState({})

  const extendBookingMutation = useExtendBooking()
  const cancelBookingMutation = useCancelBooking()
  const processPaymentMutation = useProcessPayment()

  const handleExtendBooking = async (e) => {
    e.preventDefault()

    if (!extendHours || extendHours < 1) {
      setFormErrors({ additionalHours: "Please enter at least 1 hour" })
      return
    }

    try {
      await extendBookingMutation.mutateAsync({
        id,
        data: { additionalHours: extendHours },
      })
      setShowExtendForm(false)
      setExtendHours(1)
    } catch (error) {
      setFormErrors({ general: "Failed to extend booking. Please try again." })
    }
  }

  const handleCancelBooking = async () => {
    try {
      await cancelBookingMutation.mutateAsync(id)
      // Could navigate away or stay on page to show cancelled status
    } catch (error) {
      setFormErrors({ general: "Failed to cancel booking. Please try again." })
    }
  }

  const handleProcessPayment = async (e) => {
    e.preventDefault()

    const errors = {}
    if (!paymentAmount || isNaN(paymentAmount) || Number(paymentAmount) <= 0) {
      errors.amount = "Please enter a valid amount"
    }
    if (!paymentMethod) {
      errors.method = "Please select a payment method"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      await processPaymentMutation.mutateAsync({
        bookingId: id,
        amount: Number(paymentAmount),
        method: paymentMethod,
      })
      setShowPaymentForm(false)
      setPaymentAmount("")
      setPaymentMethod("")
    } catch (error) {
      setFormErrors({ general: "Failed to process payment. Please try again." })
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      ACTIVE: "success",
      COMPLETED: "primary",
      CANCELLED: "danger",
      OVERSTAY: "warning",
    }

    return <Badge variant={variants[status] || "default"}>{status}</Badge>
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
        <p className="text-red-500 mb-4">Error loading booking details</p>
        <Button variant="secondary" onClick={() => navigate("/bookings")}>
          Back to Bookings
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate("/bookings")} className="mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Bookings
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Booking Details</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Card.Header>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Booking Information</h2>
              {getStatusBadge(booking.status)}
            </div>
          </Card.Header>
          <Card.Body>
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <TicketIcon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Slot {booking.parkingSlot.number}</h3>
                <p className="text-gray-500">Vehicle: {booking.vehicle.plateNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Start Time</p>
                <p className="mt-1 text-lg">{new Date(booking.startTime).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">End Time</p>
                <p className="mt-1 text-lg">{new Date(booking.endTime).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Parking Slot Type</p>
                <p className="mt-1 text-lg capitalize">{booking.parkingSlot.type.toLowerCase()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Floor</p>
                <p className="mt-1 text-lg">{booking.parkingSlot.floor}</p>
              </div>
            </div>

            {formErrors.general && (
              <Alert variant="error" className="mt-4">
                {formErrors.general}
              </Alert>
            )}

            {showExtendForm && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-medium mb-3">Extend Booking</h3>
                <form onSubmit={handleExtendBooking}>
                  <FormField
                    label="Additional Hours"
                    id="additionalHours"
                    name="additionalHours"
                    type="number"
                    min="1"
                    value={extendHours}
                    onChange={(e) => setExtendHours(Number.parseInt(e.target.value))}
                    error={formErrors.additionalHours}
                  />
                  <div className="flex justify-end mt-4">
                    <Button type="button" variant="secondary" className="mr-2" onClick={() => setShowExtendForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" isLoading={extendBookingMutation.isLoading}>
                      Extend Booking
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {showPaymentForm && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-medium mb-3">Process Payment</h3>
                <form onSubmit={handleProcessPayment}>
                  <FormField
                    label="Amount"
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    error={formErrors.amount}
                  />
                  <FormField
                    label="Payment Method"
                    id="method"
                    name="method"
                    type="select"
                    options={[
                      { value: "CASH", label: "Cash" },
                      { value: "CARD", label: "Card" },
                      { value: "MOBILE", label: "Mobile Payment" },
                    ]}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    error={formErrors.method}
                  />
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      className="mr-2"
                      onClick={() => setShowPaymentForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" isLoading={processPaymentMutation.isLoading}>
                      Process Payment
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </Card.Body>
          <Card.Footer>
            <div className="flex flex-wrap gap-2">
              {booking.status === "ACTIVE" && (
                <>
                  <Button variant="outline" onClick={() => setShowExtendForm(!showExtendForm)}>
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Extend Booking
                  </Button>
                  <Button variant="outline" onClick={() => setShowPaymentForm(!showPaymentForm)}>
                    <BanknoteIcon className="h-4 w-4 mr-1" />
                    Process Payment
                  </Button>
                  <Button variant="danger" onClick={() => setShowCancelConfirm(true)}>
                    Cancel Booking
                  </Button>
                </>
              )}
            </div>
          </Card.Footer>
        </Card>

        <Card>
          <Card.Header>
            <h2 className="text-lg font-medium">Booking Timeline</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                    <TicketIcon className="h-4 w-4" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Booking Created</h3>
                  <p className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {booking.status !== "ACTIVE" && (
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        booking.status === "COMPLETED"
                          ? "bg-blue-100 text-blue-600"
                          : booking.status === "CANCELLED"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      <TicketIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium">Booking {booking.status.toLowerCase()}</h3>
                    <p className="text-xs text-gray-500">{new Date(booking.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelBooking}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
        variant="danger"
      />
    </div>
  )
}

export default BookingDetailPage
