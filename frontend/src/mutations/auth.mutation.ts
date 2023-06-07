import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { queryClient } from '../hooks/useQueryClient'
import axiosInstance from '../utils/api'
import useAppointmentStore from '../store/useAppointmentStore'

interface Credentials {
  username: string
  password: string
}

const useLoginMutation = () => {
  const navigate = useNavigate()
  const { isBookingPending } = useAppointmentStore()

  return useMutation<unknown, unknown, Credentials>({
    mutationFn: async (credentials) => await axiosInstance.post('/auth/login', credentials),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['authStatus'] })
      if (isBookingPending) {
        navigate('/review')
      }
      navigate('/')
    }
  })
}

const useRegisterMutation = () => {
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()

  return useMutation<unknown, unknown, { username: string; password: string }, unknown>({
    mutationFn: async (credentials) => await axiosInstance.post('/auth/register', credentials),
    onSuccess: (data, variables, context) => {
      loginMutation.mutate({ username: variables.username, password: variables.password })
      navigate('/')
    }
  })
}

export { useLoginMutation, useRegisterMutation }
