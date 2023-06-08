import { useQuery } from '@tanstack/react-query'
import type React from 'react'
import { createContext, type PropsWithChildren } from 'react'
import axiosInstance from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'

interface AuthState {
  isAuthenticated: boolean
  data: {
    displayName?: string
    email?: string
    exp?: number
    googleId?: string
    iat?: number
    profilePicture?: string
    role: string
    userId?: string
    username?: string
  } | null
  reason: string | null
}

// Create the AuthContext
interface AuthStatusProps {
  data: AuthState
  isLoading: boolean
  isError: boolean
}

export const AuthContext = createContext<AuthStatusProps>({
  data: {
    isAuthenticated: false,
    data: null,
    reason: null
  },
  isLoading: false,
  isError: false
})

// Fetch the auth status
const getAuthStatus = async () => {
  try {
    const response = await axiosInstance.get(`/auth/status`)
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error(response.data.error)
    }
  } catch (error) {
    console.error('Failed to fetch auth status:', error)
    throw error // Rethrow the error to be caught by React Query
  }
}

// AuthContextProvider component
export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const {
    data: authStatus,
    isLoading,
    isError
  } = useQuery<AuthState>({
    queryKey: ['authStatus'],
    queryFn: getAuthStatus,
    staleTime: 0
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (authStatus) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <div>Error occurred while fetching auth status.</div>
  }

  return (
    <AuthContext.Provider value={{ data: authStatus, isLoading, isError }}>
      {children}
    </AuthContext.Provider>
  )
}
