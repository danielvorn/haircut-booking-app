import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../utils/api'
import { type Service } from '../store/useAppointmentStore'

const getServices = async () => {
  const { data } = await axiosInstance.get(`/services/`)
  return data
}

const useGetServices = () => {
  return useQuery<Service>({
    queryKey: ['services'],
    queryFn: getServices
  })
}

export { getServices, useGetServices }
