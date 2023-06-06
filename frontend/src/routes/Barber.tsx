import { NavLink } from 'react-router-dom'
import FakeImage from '../components/FakeImage'
import ListComponent from '../components/ListItem'
import LoadingSpinner from '../components/LoadingSpinner'
import { useGetBarbers } from '../queries/barber.queries'
import useAppointmentStore from '../store/useAppointmentStore'

export default function Barber() {
  const appointment = useAppointmentStore()
  const { service, date } = appointment
  const extractedDate = date !== null ? date?.split('T')[0] : new Date().toISOString()
  const duration = service?.duration ?? 60
  const { data: barbers } = useGetBarbers()

  const renderBarbers = (barber: typeof barbers, index: number): JSX.Element => {
    if (!barber) {
      return <LoadingSpinner />
    }

    return (
      <NavLink
        to={`/slots/barber/${barber._id}/date/${extractedDate as string}/duration/${duration}`}
        onClick={() => {
          appointment.setBarber(barber)
        }}>
        <div className="p-4 rounded">
          <FakeImage />
          <h1>{barber.name}</h1>
          <p className="h-20 overflow-hidden overflow-ellipsis">
            <span className="whitespace-normal line-clamp-3 font-light color-paragraph">
              {barber.biography}
            </span>
          </p>
        </div>
      </NavLink>
    )
  }

  return (
    <ListComponent
      items={barbers}
      renderListItem={renderBarbers}
      filterFields={{ name: 'string' }}
    />
  )
}
