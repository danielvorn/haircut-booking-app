import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarActions {
  setIsExpanded: (isExpanded: boolean) => void
}

interface SidebarState {
  isExpanded: boolean
}

const initialState: SidebarState = {
  isExpanded: false
}

const useSidebarStore = create<SidebarState & SidebarActions>()((set) => ({
  ...initialState,
  setIsExpanded: (isExpanded: boolean) => {
    set({ isExpanded })
  },
  reset: () => {
    set(initialState)
  }
}))

export default useSidebarStore
