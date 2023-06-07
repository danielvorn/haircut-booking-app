import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../utils/api'

export interface IService {
  [key: string]: unknown
  _id: string
  name: string
  description: string
  price: number
  duration: number
  barbers: string[]
  __v: number
}

const getServices = async () => {
  const { data } = await axiosInstance.get(`/services/`)
  return data
}

const useGetServices = () => {
  return useQuery<unknown, unknown, IService[]>({
    queryKey: ['services'],
    queryFn: getServices
  })
}

export { getServices, useGetServices }
