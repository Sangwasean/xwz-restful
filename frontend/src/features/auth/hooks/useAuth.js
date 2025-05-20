"use client"

import { useMutation, useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext"

export const useLogin = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  return useMutation((credentials) => login(credentials), {
    onSuccess: () => {
      navigate("/")
    },
  })
}

export const useRegister = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  return useMutation((userData) => register(userData), {
    onSuccess: () => {
      navigate("/login")
    },
  })
}

export const useLogout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return () => {
    logout()
    queryClient.clear()
    navigate("/login")
  }
}
