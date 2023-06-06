import { useEffect, useState } from 'react'

const useSortedAppointments = (flatAppointments) => {
  const [sortedAppointments, setSortedAppointments] = useState(flatAppointments)

  const sortAppointmentsByStartTime = (appointments, ascending) => {
    const sorted = [...appointments].sort(
      (a, b) => (ascending ? 1 : -1) * (new Date(a.slot.startTime) - new Date(b.slot.startTime))
    )
    return sorted
  }

  const sortByAscending = () => {
    const sorted = sortAppointmentsByStartTime(sortedAppointments, true)
    setSortedAppointments(sorted)
  }

  const sortByDescending = () => {
    const sorted = sortAppointmentsByStartTime(sortedAppointments, false)
    setSortedAppointments(sorted)
  }

  useEffect(() => {
    setSortedAppointments(flatAppointments)
  }, [flatAppointments])

  return [sortedAppointments, sortByAscending, sortByDescending]
}

export default useSortedAppointments
