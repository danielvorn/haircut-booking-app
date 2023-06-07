import { type QueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DarkModeContext } from '../context/DarkModeContext'
import axiosInstance from '../utils/api'
import Header from './Header'
import Sidebar from './Sidebar'

export interface IAuthStatus {
  isAuthenticated: boolean
  data: {
    displayName: string
    email: string
    exp: number
    googleId: string
    iat: number
    profilePicture: string
    role: string
    userId: string
  }
}

export const getAuthStatus = () => ({
  queryKey: ['authStatus'],
  queryFn: async () => {
    try {
      const response = await axiosInstance.get<IAuthStatus>(`/auth/status`)
      return response.data
    } catch (error: any) {
      throw new Error(error)
    }
  },
  staleTime: 0
})

export const loader = (queryClient: QueryClient) => async () => {
  const query = getAuthStatus()
  return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query))
}

const Layout: React.FC = () => {
  const { isDarkMode } = useContext(DarkModeContext)
  const location = useLocation()
  const hideSidebar = (paths: string[]) => !paths.includes(location.pathname)

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="color-background color-heading flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 p-5 overflow-auto">
            <Outlet />
          </main>
          {hideSidebar(['/login', '/review', '/appointments', '/register']) && <Sidebar />}
        </div>
      </div>
    </div>
  )
}

export default Layout
