import { useQuery } from '@tanstack/react-query'
import { type Barber } from '../store/useAppointmentStore'
import axiosInstance from '../utils/api'

const getBarbers = async () => {
  const { data } = await axiosInstance.get(`/barbers/`)
  return data
}

const useGetBarbers = () => {
  return useQuery<Barber>({
    queryKey: ['barbers'],
    queryFn: getBarbers
  })
}

export { getBarbers, useGetBarbers }
