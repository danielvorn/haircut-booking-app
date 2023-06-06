import { TbClock } from 'react-icons/tb'
import { useParams } from 'react-router-dom'
import useAppointmentSlotsAvailability from '../queries/slot.queries'
import useAppointmentStore from '../store/useAppointmentStore'
import { formatDuration } from '../utils/formatDuration'
import { formatTime } from '../utils/formatTime'

interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
}

export default function Slots() {
  const appointment = useAppointmentStore()
  const { service } = appointment
  const params = useParams()
  const { barberId, date: queryParamDate, duration } = params
  const { data: slots } = useAppointmentSlotsAvailability({ barberId, queryParamDate, duration })

  const getFilteredSlots = (startHour: number, endHour: number) => {
    if (slots) {
      return slots?.filter((slot) => {
        const slotTime = new Date(slot.startTime).getHours()
        const endTime = new Date(slot.startTime).getHours()
        return slotTime >= startHour && endTime <= endHour
      })
    }
  }

  const filteredMorningSlots = getFilteredSlots(9, 11)
  const filteredAfternoonSlots = getFilteredSlots(12, 17)

  const renderSlot = (slot: TimeSlot, index: number, period: string) => {
    const startTime = new Date(slot.startTime)
    const endTime = new Date(slot.endTime)
    return (
      <div
        key={index}
        className={`${
          slot.isAvailable
            ? 'color-border color-hover cursor-pointer slot-item text-sm p-2 rounded-lg'
            : 'color-border text-sm p-2 line-through rounded-lg opacity-30'
        } `}
        onClick={() => {
          if (slot.isAvailable)
            appointment.setSlot({
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString()
            })
        }}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-md">{formatTime(startTime)}</span>
            <span className="text-md">
              <span> - </span>
              {formatTime(endTime)}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <TbClock />
          <span className="text-sm font-light">{formatDuration(service?.duration)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-md my-2">Morning</h3>
          <div className="grid grid-cols-2 gap-2">
            {filteredMorningSlots?.map((slot: TimeSlot, index: number) =>
              renderSlot(slot, index, 'morning')
            )}
          </div>
        </div>
        <div>
          <h3 className="text-md my-2">Afternoon</h3>
          <div className="grid grid-cols-2 gap-2">
            {filteredAfternoonSlots?.map((slot: TimeSlot, index: number) =>
              renderSlot(slot, index, 'afternoon')
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
