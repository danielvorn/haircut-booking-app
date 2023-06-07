import { useEffect, useState } from 'react'
import { type Appointment } from '../routes/Appointments'

type SortByAscending = () => void
type SortByDescending = () => void

const useSortedAppointments = (
  flatAppointments: Appointment[]
): [Appointment[], SortByAscending, SortByDescending] => {
  const [sortedAppointments, setSortedAppointments] = useState<Appointment[]>(flatAppointments)

  const sortAppointmentsByStartTime = (
    appointments: Appointment[],
    ascending: boolean
  ): Appointment[] => {
    const sorted = [...appointments].sort(
      (a, b) =>
        ((ascending ? 1 : -1) as any) *
        ((new Date(a.slot.startTime) as any) - (new Date(b.slot.startTime) as any))
    )
    return sorted
  }

  const sortByAscending: SortByAscending = () => {
    const sorted = sortAppointmentsByStartTime(sortedAppointments, true)
    setSortedAppointments(sorted)
  }

  const sortByDescending: SortByDescending = () => {
    const sorted = sortAppointmentsByStartTime(sortedAppointments, false)
    setSortedAppointments(sorted)
  }

  useEffect(() => {
    setSortedAppointments(flatAppointments)
  }, [flatAppointments])

  return [sortedAppointments, sortByAscending, sortByDescending]
}

export default useSortedAppointments
