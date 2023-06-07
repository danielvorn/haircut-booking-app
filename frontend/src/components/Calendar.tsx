import type React from 'react'
import { useState } from 'react'
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import useAppointmentStore from '../store/useAppointmentStore'

const Calendar: React.FC = () => {
  const appointment = useAppointmentStore()
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  const handlePreviousMonth = () => {
    setCurrentDate((prevDate: Date) => {
      const prevMonth = prevDate.getMonth() - 1
      return new Date(prevDate.getFullYear(), prevMonth, 1)
    })
  }

  const handleNextMonth = () => {
    setCurrentDate((prevDate: Date) => {
      const nextMonth = prevDate.getMonth() + 1
      return new Date(prevDate.getFullYear(), nextMonth, 1)
    })
  }

  const handleDayClick = (date: Date) => {
    const selectedDay = new Date(date.setDate(date.getDate() + 1)).toISOString()
    const extractedDate =
      selectedDay !== null ? selectedDay?.split('T')[0] : new Date().toISOString()

    appointment.setDate(extractedDate)
    navigate('/barbers')
  }

  const getWeekdaysRow = (): React.ReactElement[] => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return weekDays.map((day) => (
      <div key={day} className="calendar-cell calendar-header text-sm font-medium text-paragraph">
        {day}
      </div>
    ))
  }

  const getEmptyCells = (count: number): React.ReactElement[] => {
    return Array.from({ length: count }).map((_, index) => (
      <div key={`empty-${index}`} className="calendar-cell empty-day" />
    ))
  }

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date()

    if (date.getTime() < new Date(today.setHours(0, 0, 0, 0)).getTime()) {
      return true // Disable dates before today
    }

    if (date.toDateString() === today.toDateString() && today.getHours() >= 17) {
      return true // Disable today's date if it is past 11 PM
    }

    return false // Enable other dates
  }

  const getDayClass = (isDisabled: boolean): string => {
    return isDisabled ? 'disabled-day text-gray-500 cursor-default' : 'active-day cursor-pointer'
  }

  const isDateToday = (date: Date, year: number, month: number): boolean => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const getCalendarDays = (): React.ReactElement[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayIndex = new Date(year, month, 1).getDay()

    const days: React.ReactElement[] = []

    days.push(...getWeekdaysRow())
    days.push(...getEmptyCells(firstDayIndex))

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isDisabled = isDateDisabled(date)
      const dayClass = getDayClass(isDisabled)
      const isToday = isDateToday(date, year, month)

      const circleToday = isToday
        ? 'calendar-cell calendar-day today border border-gray-900 dark:border-white'
        : 'calendar-cell calendar-day'
      const onHoverActiveDays = !isDisabled ? 'rounded-full hover:color-hover' : 'rounded-full'

      days.push(
        <div
          key={date.toISOString()}
          className={`flex justify-center items-center ${dayClass}`}
          onClick={() => {
            if (!isDisabled) {
              handleDayClick(date)
            }
          }}>
          <span
            className={`inline-flex items-center justify-center w-6 h-6 p-4 rounded-full ${circleToday} ${onHoverActiveDays}`}>
            {day}
          </span>
        </div>
      )
    }

    return days
  }

  return (
    <div className="calendar-container space-y-4">
      <div className="calendar-grid grid grid-cols-7 gap-6 text-center">
        <div className="col-span-1">
          <button className="calendar-button text-gray-500 text-2xl" onClick={handlePreviousMonth}>
            <TbChevronLeft />
          </button>
        </div>
        <div className="col-span-2" />
        <div className="col-span-1">
          <h3 className="calendar-title text-lg font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        <div className="col-span-2" />
        <div className="col-span-1">
          <button className="calendar-button text-gray-500 text-2xl" onClick={handleNextMonth}>
            <TbChevronRight />
          </button>
        </div>
        {getCalendarDays()}
      </div>
    </div>
  )
}

export default Calendar
