import type React from 'react'
import { NavLink, useLoaderData } from 'react-router-dom'
import useAppointmentStore from '../store/useAppointmentStore'
import FakeImage from './FakeImage'
import ListComponent from './ListItem'

export interface IBarber {
  _id: string
  user: string
  name: string
  biography: string
}

const BarberList: React.FC = () => {
  const barbers = useLoaderData() as IBarber[]
  const appointment = useAppointmentStore()
  const { service, date } = appointment
  const extractedDate = date !== null ? date?.split('T')[0] : new Date().toISOString()
  const duration = service?.duration ?? 60

  const renderBarbers = (barber: IBarber): JSX.Element => {
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

export default BarberList
