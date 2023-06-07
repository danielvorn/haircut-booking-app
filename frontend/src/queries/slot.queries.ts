import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../utils/api'

const fetchAppointmentSlotsAvailability = async ({
  barberId,
  date,
  duration
}: {
  barberId: string
  date: string
  duration: string
}) => {
  const response = await axiosInstance.get('/appointments/slots/availability', {
    params: { barberId, date, duration }
  })
  return response.data
}

const useAppointmentSlotsAvailability = ({
  barberId,
  date,
  duration
}: {
  barberId: string
  date: string
  duration: string
}) => {
  return useQuery({
    queryKey: ['appointmentSlotsAvailability', barberId, date, duration],
    queryFn: async () => await fetchAppointmentSlotsAvailability({ barberId, date, duration })
  })
}

export default useAppointmentSlotsAvailability
