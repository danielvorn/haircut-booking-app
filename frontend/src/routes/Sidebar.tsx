import { useEffect } from 'react'
import {
  TbCalendar,
  TbCircleX,
  TbClock,
  TbCut,
  TbHourglass,
  TbLayoutSidebarRightExpand,
  TbListSearch
} from 'react-icons/tb'
import { NavLink } from 'react-router-dom'
import useAppointmentStore from '../store/useAppointmentStore'
import useSidebarStore from '../store/useSidebarStore'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDuration } from '../utils/formatDuration'
import { formatTime } from '../utils/formatTime'

const Sidebar = () => {
  const { service, date, barber, slot } = useAppointmentStore()
  const { isExpanded, setIsExpanded } = useSidebarStore()

  useEffect(() => {
    setIsExpanded(Boolean(service || date || barber || slot))
  }, [service, date, barber, slot])

  const handleToggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const renderContentItem = (title, icon, content) => (
    <div className="flex flex-col rounded-lg color-border color-heading p-3">
      <h1>{title}</h1>
      <div className="flex items-center font-light space-x-2 color-paragraph">
        {icon && <span className="color-heading">{icon}</span>}
        {content}
      </div>
    </div>
  )

  const renderAppointmentDate = () =>
    date &&
    renderContentItem(
      'Appointment Date',
      <TbCalendar />,
      <span className="text-primary">{new Date(date).toDateString()}</span>
    )

  const renderService = () =>
    service &&
    renderContentItem(
      service.name,
      undefined,
      <div>
        <div className="flex flex-col space-y-1">
          <p className="font-light whitespace-normal line-clamp-4">{service.description}</p>
          <span className="flex items-center space-x-1">
            <TbHourglass /> <span>{formatDuration(service?.duration)}</span>
          </span>
        </div>
      </div>
    )

  const renderBarber = () =>
    barber &&
    renderContentItem('Barber', <TbCut />, <span className="text-primary">{barber.name}</span>)

  const renderSlot = () =>
    slot &&
    renderContentItem(
      'Slot',
      <TbClock />,
      <span>{`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}</span>
    )

  const renderPrice = () =>
    service != null &&
    date &&
    barber != null &&
    slot != null && (
      <p className="space-x-2">
        <span>Price</span>
        <span className="text-xl">{formatCurrency(service.price)}</span>
      </p>
    )

  const renderNoBookingDetails = () =>
    service == null &&
    !date &&
    barber == null &&
    slot == null && <p className="italic">No booking details yet...</p>

  const renderReviewButton = () =>
    service != null &&
    date &&
    barber != null &&
    slot != null && (
      <NavLink
        className="bg-sky-600 dark:bg-sky-900 text-neutral-100 flex justify-center p-2 rounded-md"
        to="/review">
        <div className="flex items-center space-x-2">
          <TbListSearch />
          <span>Review</span>
        </div>
      </NavLink>
    )

  return (
    <aside
      className={`color-heading flex flex-col space-y-2 w-64 p-4 transition-all ${
        isExpanded ? 'max-w-xs' : 'w-fit'
      }`}>
      <div
        className={`flex items-center text-xl ${isExpanded ? 'justify-end' : ''}`}
        onClick={handleToggleSidebar}>
        <button className="focus:outline-none">
          {isExpanded ? <TbCircleX /> : <TbLayoutSidebarRightExpand />}
        </button>
      </div>
      {isExpanded && (
        <>
          <h1 className="text-lg">Summary</h1>
          {renderAppointmentDate()}
          {renderService()}
          {renderBarber()}
          {renderSlot()}
          {renderPrice()}
          {renderNoBookingDetails()}
          {renderReviewButton()}
        </>
      )}
    </aside>
  )
}

export default Sidebar
