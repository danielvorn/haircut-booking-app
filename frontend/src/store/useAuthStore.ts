import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthState {
  userId: string | null
  googleId: string | null
  role: string | null
  displayName: string | null
  profilePicture: string | null
  iat: string | null
  exp: string | null
}

export interface AuthActions {
  setUserId: (userId: string) => void
  setGoogleId: (googleId: string) => void
  setRole: (role: string) => void
  setDisplayName: (displayName: string) => void
  setProfilePicture: (profilePicture: string) => void
  setIat: (iat: string) => void
  setExp: (exp: string) => void
  reset: () => void
}

const initialState: AuthState = {
  userId: null,
  googleId: null,
  role: null,
  displayName: null,
  profilePicture: null,
  iat: null,
  exp: null
}

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      setUserId: (userId: string) => {
        set({ userId })
      },
      setGoogleId: (googleId: string) => {
        set({ googleId })
      },
      setRole: (role: string) => {
        set({ role })
      },
      setDisplayName: (displayName: string) => {
        set({ displayName })
      },
      setProfilePicture: (profilePicture: string) => {
        set({ profilePicture })
      },
      setIat: (iat: string) => {
        set({ iat })
      },
      setExp: (exp: string) => {
        set({ exp })
      },
      reset: () => {
        set(initialState)
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)
export default useAuthStore
