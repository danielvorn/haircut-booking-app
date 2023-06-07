import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../utils/api'

export interface IBarber {
  [key: string]: unknown
  _id: string
  user: string
  name: string
  biography: string
  __v: number
}

const getBarbers = async () => {
  const { data } = await axiosInstance.get(`/barbers/`)
  return data
}

const useGetBarbers = () => {
  return useQuery<unknown, unknown, IBarber[]>({
    queryKey: ['barbers'],
    queryFn: getBarbers
  })
}

export { getBarbers, useGetBarbers }
