"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useRegister } from "../hooks/useAuth"
import FormField from "../../../components/common/molecules/FormField"
import Button from "../../../components/common/atoms/Button"
import Alert from "../../../components/common/atoms/Alert"
import Card from "../../../components/common/atoms/Card"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})

  const registerMutation = useRegister()

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

    if (!formData.firstName) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = formData

    try {
      await registerMutation.mutateAsync(userData)
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ general: error.response.data.message || "Registration failed" })
      } else {
        setErrors({ general: "An error occurred. Please try again." })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <Card.Body>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">Create an account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                sign in to your account
              </Link>
            </p>
          </div>

          {errors.general && (
            <Alert variant="error" className="mb-4">
              {errors.general}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="First Name"
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />

              <FormField
                label="Last Name"
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
            </div>

            <FormField
              label="Email Address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <FormField
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <FormField
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <div className="mt-6">
              <Button type="submit" className="w-full" isLoading={registerMutation.isLoading}>
                Register
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default RegisterPage
