import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Service {
  _id: string
  name: string
  description: string
  price: number
  duration: number
  barbers: string[]
}

export interface Barber {
  _id: string
  user: string
  name: string
  biography: string
}

export interface Slot {
  startTime: string
  endTime: string
}

export interface AppointmentState {
  service?: Service | null
  date?: string | null
  slot?: Slot | null
  barber?: Barber | null
  isBookingPending?: boolean | null
}

export interface AppointmentActions {
  setService: (service: Service) => void
  setDate: (date: string) => void
  setSlot: (slot: Slot | null) => void
  setBarber: (barber: Barber) => void
  setIsBookingPending: (isBookingPending: boolean) => void
  reset: () => void
}

const initialState: AppointmentState = {
  service: null,
  date: null,
  slot: null,
  barber: null,
  isBookingPending: null
}

const useAppointmentStore = create<AppointmentState & AppointmentActions>()(
  persist(
    (set) => ({
      ...initialState,
      setService: (service: Service) => {
        set({ service })
      },
      setDate: (date: string) => {
        set({ date })
      },
      setSlot: (slot: Slot | null) => {
        set({ slot })
      },
      setBarber: (barber: Barber) => {
        set({ barber })
      },
      setIsBookingPending: (isBookingPending: boolean) => {
        set({ isBookingPending })
      },
      reset: () => {
        set(initialState)
        useAppointmentStore.persist.clearStorage()
      }
    }),
    {
      name: 'appointment-storage'
    }
  )
)

export default useAppointmentStore
