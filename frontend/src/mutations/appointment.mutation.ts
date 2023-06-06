import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../hooks/useQueryClient'
import axiosInstance from '../utils/api'
import { useNavigate } from 'react-router-dom'
import useAppointmentStore from '../store/useAppointmentStore'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

interface AppointmentDetails {
  barber: string | undefined
  client: string | undefined
  service: string | undefined
  slot: {
    startTime: string | undefined
    endTime: string | undefined
  }
}

const useBookAppointmentMutation = () => {
  const navigate = useNavigate()
  const { reset } = useAppointmentStore()
  const { data: authStatus } = useContext(AuthContext)
  const userId = authStatus.data?.userId

  const bookAppointment = async (appointmentDetails: AppointmentDetails) => {
    return await axiosInstance.post(`/appointments`, appointmentDetails)
  }

  return useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointments', userId, 'upcoming']
      })
      navigate('/appointments')
      reset()
    }
  })
}

export default useBookAppointmentMutation
