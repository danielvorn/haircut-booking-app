import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Calendar from './components/Calendar'
import Login from './components/Login'
import Redirect from './components/Redirect'
import Review from './components/Review'
import { AuthProvider } from './context/AuthContext'
import { DarkModeProvider } from './context/DarkModeContext'
import ErrorPage from './error-page'
import { queryClient } from './hooks/useQueryClient'
import './index.css'
import AppointmentList from './routes/Appointments'
import Barber from './routes/Barber'
import Layout from './routes/Layout'
import Service from './routes/Service'
import Slots from './routes/Slots'
import Register from './components/Register'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        index: true,
        element: <Service />
      },
      {
        path: 'calendar',
        element: <Calendar />
      },
      {
        path: 'barbers',
        element: <Barber />
      },
      {
        path: '/slots/barber/:barberId/date/:date/duration/:duration',
        element: <Slots />
      },
      {
        path: '/review',
        element: <Review />
      },
      {
        path: '/redirect',
        element: <Redirect />
      },
      {
        path: 'appointments/',
        element: <AppointmentList />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </DarkModeProvider>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  </React.StrictMode>
)
