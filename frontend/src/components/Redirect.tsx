import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppointmentStore from '../store/useAppointmentStore'

const Redirect = () => {
  const navigate = useNavigate()
  const { isBookingPending } = useAppointmentStore()
  useEffect(() => {
    if (isBookingPending) {
      navigate('/review')
      return
    }
    navigate('/')
  }, [])

  return null
}

export default Redirect
