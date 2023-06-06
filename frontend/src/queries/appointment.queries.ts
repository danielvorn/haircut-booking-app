import { useInfiniteQuery } from '@tanstack/react-query'
import { type NavigateFunction, useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/api'

const useGetAppointmentUpcomingQuery = ({ userId }: { userId: string }) => {
  const navigate = useNavigate()
  return useInfiniteQuery({
    queryKey: ['appointments', userId, 'upcoming'],
    queryFn: getUpcomingAppointments(userId, navigate),
    getNextPageParam: (page) =>
      page.totalPages === page.currentPage ? undefined : (page.currentPage as number) + 1
  })
}

const useGetAppointmentHistoryQuery = ({ userId }: { userId: string }) => {
  const navigate = useNavigate()
  return useInfiniteQuery({
    queryKey: ['appointments', userId, 'history'],
    queryFn: getAppointmentsHistory(userId, navigate),
    getNextPageParam: (page) =>
      page.totalPages === page.currentPage ? undefined : (page.currentPage as number) + 1
  })
}

function getAppointmentsHistory(userId: string, navigate: NavigateFunction) {
  return async function ({ pageParam = 1 }) {
    try {
      const res = await axiosInstance.get(`/appointments/client/${userId}`, {
        params: {
          time: 'history',
          page: pageParam
        }
      })
      return res.data
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 401) {
        navigate('/login')
      }
    }
  }
}

function getUpcomingAppointments(userId: string, navigate: NavigateFunction) {
  return async ({ pageParam = 1 }) => {
    try {
      const res = await axiosInstance.get(`/appointments/client/${userId}`, {
        params: {
          time: 'upcoming',
          page: pageParam
        }
      })
      return res.data
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 401) {
        navigate('/login')
      }
    }
  }
}

export { useGetAppointmentUpcomingQuery, useGetAppointmentHistoryQuery }
