import { NavLink } from 'react-router-dom'
import FakeImage from '../components/FakeImage'
import ListComponent from '../components/ListItem'
import LoadingSpinner from '../components/LoadingSpinner'
import { useGetServices, type IService } from '../queries/service.queries'
import useAppointmentStore from '../store/useAppointmentStore'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDuration } from '../utils/formatDuration'

export default function Service() {
  const appointment = useAppointmentStore()
  const { data: services } = useGetServices()

  const renderServices = (service: IService): JSX.Element => {
    if (!service) {
      return <LoadingSpinner />
    }

    return (
      <NavLink
        to={'/calendar'}
        onClick={() => {
          appointment.setSlot(null)
          appointment.setService(service)
        }}>
        <div className="p-4 rounded">
          <FakeImage />
          <h1>{service.name}</h1>
          <p className="h-20 overflow-hidden overflow-ellipsis color-paragraph">
            <span className="whitespace-normal line-clamp-3 font-light ">
              {service.description}
            </span>
          </p>
          <p className="flex items-end justify-between text-sm font-light mt-3">
            <span className="font-light">{formatCurrency(service.price)}</span>
            <span>{formatDuration(service.duration)}</span>
          </p>
        </div>
      </NavLink>
    )
  }

  return (
    <ListComponent
      items={services ?? []}
      renderListItem={renderServices}
      filterFields={{ name: 'string', price: 'number', duration: 'number' }}
    />
  )
}
