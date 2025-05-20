"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "react-query"
import FormField from "../../../components/common/molecules/FormField"
import Button from "../../../components/common/atoms/Button"
import Alert from "../../../components/common/atoms/Alert"
import Card from "../../../components/common/atoms/Card"
import { authService } from '../../../services/authService'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        
        // Immediate verification
        const user = authService.getCurrentUser()
        const isAuth = authService.isAuthenticated()
        
        console.log('Post-login verification:', { user, isAuth })
        
        if (isAuth && user) {
          console.log('Navigation triggered from onSuccess')
          navigate('/', { replace: true }) // Added replace option
        }
      }
    },
    onError: (error) => {
      console.error('Login error:', error)
      setErrors({ 
        general: error.response?.data?.message || 
                'Login failed. Please try again.'
      })
      authService.logout()
    }
  })

  // Handle potential navigation issues
  useEffect(() => {
    // Check if we're already authenticated (in case of page refresh)
    if (authService.isAuthenticated() && authService.getCurrentUser()) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.password) newErrors.password = "Password is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    loginMutation.mutate(formData) // Using mutate instead of mutateAsync
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <Card.Body>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">Sign in</h1>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                create a new account
              </Link>
            </p>
          </div>

          {errors.general && (
            <Alert variant="error" className="mb-4">
              {errors.general}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <div className="mt-6">
              <Button 
                type="submit" 
                className="w-full" 
                isLoading={loginMutation.isLoading}
                disabled={loginMutation.isLoading}
              >
                Sign in
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default LoginPage