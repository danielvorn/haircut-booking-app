import type React from 'react'
import { TbClock } from 'react-icons/tb'
import { useLoaderData } from 'react-router-dom'
import useAppointmentStore from '../store/useAppointmentStore'

interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
}

const TimeSlotsList: React.FC = () => {
  const timeSlots = useLoaderData() as TimeSlot[]
  const appointment = useAppointmentStore()
  const { service } = appointment

  const getFilteredSlots = (startHour: number, endHour: number) => {
    return timeSlots.filter((slot) => {
      const slotTime = new Date(slot.startTime).getHours()
      const endTime = new Date(slot.startTime).getHours()
      return slotTime >= startHour && endTime <= endHour
    })
  }

  const filteredMorningSlots = getFilteredSlots(9, 11)
  const filteredAfternoonSlots = getFilteredSlots(12, 17)

  const renderSlot = (slot: TimeSlot, index: number, period: string) => {
    const startTime = new Date(slot.startTime)
    const endTime = new Date(slot.endTime)

    return (
      <div
        key={index}
        className={`color-border color-hover cursor-pointer slot-item ${period}-slot text-sm p-2 rounded-lg ${
          slot.isAvailable ? 'reserved-slot' : ''
        }`}
        onClick={() => {
          appointment.setSlot({
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString()
          })
        }}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-md">
              {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-md">
              <span> - </span>
              {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <TbClock />
          <span className="text-sm font-light">{service?.duration} min</span>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 space-y-2">
      <h2 className="text-xl b-2">Choose a Timeslot</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-md my-2">Morning</h3>
          <div className="grid grid-cols-2 gap-2">
            {filteredMorningSlots.map((slot: TimeSlot, index: number) =>
              renderSlot(slot, index, 'morning')
            )}
          </div>
        </div>
        <div>
          <h3 className="text-md my-2">Afternoon</h3>
          <div className="grid grid-cols-2 gap-2">
            {filteredAfternoonSlots.map((slot: TimeSlot, index: number) =>
              renderSlot(slot, index, 'afternoon')
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeSlotsList
