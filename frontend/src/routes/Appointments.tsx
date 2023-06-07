import { type FetchNextPageOptions, type InfiniteQueryObserverResult } from '@tanstack/react-query'
import type React from 'react'
import { forwardRef, useContext, useEffect, useMemo, useState, type MouseEventHandler } from 'react'
import { TbArrowsSort, TbCalendar, TbClock, TbCut } from 'react-icons/tb'
import { useInView } from 'react-intersection-observer'
import LoadingSpinner from '../components/LoadingSpinner'
import Tabs from '../components/Tab'
import { AuthContext } from '../context/AuthContext'
import useSortedAppointments from '../hooks/useSortAppointments'
import {
  useGetAppointmentHistoryQuery,
  useGetAppointmentUpcomingQuery
} from '../queries/appointment.queries'
import { formatCurrency } from '../utils/formatCurrency'
import { formatTime } from '../utils/formatTime'

interface AppointmentSectionProps {
  title: string
  icon?: React.ReactElement
  content: React.ReactNode
}
const AppointmentSection: React.FC<AppointmentSectionProps> = ({ title, icon, content }) => (
  <div className="flex flex-col rounded-lg color-border color-heading p-2">
    <h1>{title}</h1>
    <div className="flex items-center space-x-2">
      {icon && <span className="color-heading">{icon}</span>}
      <span className="flex items-center font-light space-x-2 color-paragraph">{content}</span>
    </div>
  </div>
)

type Tab = 'upcoming' | 'past'

interface Service {
  name: string
  description: string
  price: number
}

interface Barber {
  name: string
}

export interface Appointment {
  slot: {
    startTime: string
    endTime: string
  }
  service: Service
  barber: Barber
}

interface SortButtonsProps {
  activeTab: Tab
  sortByAscending: MouseEventHandler<HTMLButtonElement>
  sortByDescending: MouseEventHandler<HTMLButtonElement>
}

const SortButtons: React.FC<SortButtonsProps> = ({
  activeTab,
  sortByAscending,
  sortByDescending
}) => (
  <div className="flex space-x-3">
    <span className="flex items-center space-x-2 color-heading">
      <TbArrowsSort /> <p>Sort Dates</p>
    </span>
    <button onClick={activeTab === 'upcoming' ? sortByAscending : sortByAscending}>
      <span className="font-light color-paragraph">
        {activeTab === 'upcoming' ? 'Sooner' : 'Less Recent'}
      </span>
    </button>
    <button onClick={activeTab === 'upcoming' ? sortByDescending : sortByDescending}>
      <span className="font-light color-paragraph">
        {activeTab === 'upcoming' ? 'Later' : 'Most Recent'}
      </span>
    </button>
  </div>
)

interface AppointmentItemsProps {
  sortedAppointments: Appointment[]
}

const AppointmentItems = forwardRef<HTMLLIElement, AppointmentItemsProps>(
  function AppointmentItemsComponent({ sortedAppointments }, ref) {
    return (
      <ul className="space-y-3">
        {sortedAppointments?.map((appointment, index) => (
          <li key={index} className="color-secondary rounded-lg p-4" ref={ref}>
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-3">
                <AppointmentSection
                  title="Appointment Date"
                  icon={<TbCalendar />}
                  content={<span>{new Date(appointment?.slot?.startTime).toDateString()}</span>}
                />
              </div>
              <div className="col-span-3">
                <AppointmentSection
                  title="Slot"
                  icon={<TbClock />}
                  content={
                    <span>
                      {`${formatTime(appointment?.slot?.startTime)} - ${formatTime(
                        appointment?.slot?.endTime
                      )}`}
                    </span>
                  }
                />
              </div>
              <div className="col-span-6">
                <AppointmentSection
                  title={appointment?.service?.name}
                  icon={undefined}
                  content={<p>{appointment?.service?.description}</p>}
                />
              </div>
              <div className="col-span-6">
                <AppointmentSection
                  title="Barber"
                  icon={<TbCut />}
                  content={<span className="p-1">{appointment?.barber?.name}</span>}
                />
                <div className="flex items-center justify-end space-x-2 pt-2 text-lg">
                  <h1>Total</h1>
                  <p className="font-light">{formatCurrency(appointment?.service?.price)}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  }
)

const useFetchNextPage = (
  inView: boolean,
  activeTab: Tab,
  fetchNextPageUpcoming: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<any, unknown>>,
  fetchNextPageHistory: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<any, unknown>>
) => {
  useEffect(() => {
    if (inView) {
      if (activeTab === 'upcoming') {
        void fetchNextPageHistory()
      } else if (activeTab === 'past') {
        void fetchNextPageHistory()
      }
    }
  }, [inView, activeTab, fetchNextPageUpcoming, fetchNextPageHistory])
}

const AppointmentList: React.FC = () => {
  const { ref, inView } = useInView()
  const { data: authData } = useContext(AuthContext)
  const userId = authData?.data?.userId ?? ''

  const {
    status: statusUpcoming,
    data: dataUpcoming,
    isFetching: isFetchingUpcoming,
    isFetchingNextPage: isFetchingNextPageUpcoming,
    fetchNextPage: fetchNextPageUpcoming
  } = useGetAppointmentUpcomingQuery({ userId })

  const {
    status: statusHistory,
    data: dataHistory,
    isFetching: isFetchingHistory,
    isFetchingNextPage: isFetchingNextPageHistory,
    fetchNextPage: fetchNextPageHistory
  } = useGetAppointmentHistoryQuery({ userId })

  const dataAppointmentsUpcoming = dataUpcoming?.pages
  const dataAppointmentsHistory = dataHistory?.pages
  const [activeTab, setActiveTab] = useState<Tab>('upcoming')

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
  }

  const flatAppointmentsUpcoming: Appointment[] | undefined = useMemo(() => {
    return dataAppointmentsUpcoming?.flatMap((obj) => obj.appointments) ?? []
  }, [dataAppointmentsUpcoming])

  const flatAppointmentsHistory: Appointment[] | undefined = useMemo(() => {
    return dataAppointmentsHistory?.flatMap((obj) => obj.appointments) ?? []
  }, [dataAppointmentsHistory])

  const [sortedAppointmentsUpcoming, sortByAscendingUpcoming, sortByDescendingUpcoming] =
    useSortedAppointments(flatAppointmentsUpcoming)

  const [sortedAppointmentsHistory, sortByAscendingHistory, sortByDescendingHistory] =
    useSortedAppointments(flatAppointmentsHistory)

  useFetchNextPage(inView, activeTab, fetchNextPageUpcoming, fetchNextPageHistory)

  return (
    <div className="flex justify-center">
      <div className="max-w-4xl w-full">
        <div className="flex items-center justify-between pb-3">
          <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
          <SortButtons
            activeTab={activeTab}
            sortByAscending={
              activeTab === 'upcoming' ? sortByAscendingUpcoming : sortByAscendingHistory
            }
            sortByDescending={
              activeTab === 'upcoming' ? sortByDescendingUpcoming : sortByDescendingHistory
            }
          />
        </div>

        {(statusUpcoming === 'loading' || statusHistory === 'loading') && <LoadingSpinner />}
        {activeTab === 'upcoming' && (
          <AppointmentItems ref={ref} sortedAppointments={sortedAppointmentsUpcoming} />
        )}
        {activeTab === 'past' && (
          <AppointmentItems ref={ref} sortedAppointments={sortedAppointmentsHistory} />
        )}

        <div className="flex justify-center mt-3">
          {(isFetchingHistory ||
            isFetchingUpcoming ||
            isFetchingNextPageHistory ||
            isFetchingNextPageUpcoming) && <p>Loading more...</p>}
        </div>
      </div>
    </div>
  )
}

export default AppointmentList
