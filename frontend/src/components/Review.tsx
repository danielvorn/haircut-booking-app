import type React from 'react'
import { useContext } from 'react'
import {
  TbCalendar,
  TbClock,
  TbCut,
  TbHourglass,
  TbListSearch,
  TbSquareRoundedCheckFilled
} from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import useBookAppointmentMutation from '../mutations/appointment.mutation'
import useAppointmentStore from '../store/useAppointmentStore'
import { formatDuration } from '../utils/formatDuration'
import { formatTime } from '../utils/formatTime'
import BlockingOverlay from './BlockingOverlay'

const Review: React.FC = () => {
  const appointment = useAppointmentStore()
  const { data: authStatus } = useContext(AuthContext)
  const userId = authStatus.data?.userId
  const isAuthenticated = authStatus?.isAuthenticated
  const navigate = useNavigate()
  const { barber, date, service, slot, setIsBookingPending, reset } = appointment

  const {
    mutate: bookAppointment,
    isLoading,
    isSuccess,
    isError,
    error
  } = useBookAppointmentMutation()

  const handleBookAppointment = () => {
    try {
      if (!isAuthenticated) {
        setIsBookingPending(true)
        navigate('/login')
        throw new Error('Redirecting user to authenticate')
      }

      const appointmentDetails = {
        barber: barber?._id,
        client: userId,
        service: service?._id,
        slot: { startTime: slot?.startTime, endTime: slot?.endTime }
      }

      bookAppointment(appointmentDetails)
    } catch (error) {
      // Handle error
    }
  }

  if (!service || !slot) {
    return null
  }

  return (
    <div>
      <BlockingOverlay isVisible={isLoading} />
      <div className="flex items-center justify-center h-full">
        <div className="max-w-xl w-full p-8 rounded-lg shadow space-y-4 color-heading color-component-primary">
          <div className="flex items-center text-xl space-x-2">
            <span>
              <h1 className="text-xl">Review</h1>
            </span>
            <TbListSearch />
          </div>
          <div className="flex flex-col rounded-lg color-primary color-heading p-3 color-border">
            <h1>Appointment Date</h1>
            <div className="flex items-center space-x-2">
              {Boolean(<TbCalendar />) && (
                <span className="color-heading">
                  <TbCalendar />
                </span>
              )}
              <span className="flex items-center font-light space-x-2 color-paragraph">
                <span className="text-primary">{new Date(date).toDateString()}</span>
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col rounded-lg color-primary color-heading p-3 color-border">
              <h1>Slot</h1>
              <div className="flex items-center space-x-2">
                {Boolean(<TbClock />) && (
                  <span className="color-heading">
                    <TbClock />
                  </span>
                )}
                <span className="flex items-center font-light space-x-2 color-paragraph">
                  <span className="text-primary">{`${formatTime(slot?.startTime)} - ${formatTime(
                    slot?.endTime
                  )}`}</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col rounded-lg color-primary color-heading p-3 color-border">
              <h1>Barber</h1>
              <div className="flex items-center space-x-2">
                {Boolean(<TbCut />) && (
                  <span className="color-heading">
                    <TbCut />
                  </span>
                )}
                <span className="flex items-center font-light space-x-2 color-paragraph">
                  <span className="text-primary">{barber?.name}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col rounded-lg color-primary color-heading p-3 color-border">
            <h1>{service.name}</h1>
            <div>
              <div className="flex flex-col space-y-1">
                <p className="font-light">{service.description}</p>
                <span className="flex items-center space-x-1">
                  <TbHourglass /> <span>{formatDuration(service?.duration)}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="p-2 font-semibold rounded-md bg-sky-600 text-neutral-100 dark:bg-sky-900"
              onClick={handleBookAppointment}>
              <div className="flex items-center space-x-2">
                <TbSquareRoundedCheckFilled />
                <span>Book Appointment</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Review
