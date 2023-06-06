import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { queryClient } from '../hooks/useQueryClient'
import axiosInstance from '../utils/api'
import useAppointmentStore from '../store/useAppointmentStore'

const useLoginMutation = () => {
  const navigate = useNavigate()
  const { isBookingPending } = useAppointmentStore()

  return useMutation({
    mutationFn: async (credentials) => await axiosInstance.post('/auth/login', credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authStatus'] })
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

  return useMutation({
    mutationFn: async (credentials) => await axiosInstance.post('/auth/register', credentials),
    onSuccess: (data, variables, context) => {
      loginMutation.mutate({ username: variables.username, password: variables.password })
      navigate('/')
    }
  })
}

export { useLoginMutation, useRegisterMutation }
