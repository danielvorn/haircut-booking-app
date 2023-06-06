import type React from 'react'
import { type PropsWithChildren, createContext, useState, useEffect } from 'react'

interface DarkModeContextProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export const DarkModeContext = createContext<DarkModeContextProps>({
  isDarkMode: false,
  toggleDarkMode: () => {}
})

export const DarkModeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode')
    setIsDarkMode(storedDarkMode === 'true')
  }, [])

  const toggleDarkMode = (): void => {
    const updatedDarkMode = !isDarkMode
    setIsDarkMode(updatedDarkMode)
    localStorage.setItem('darkMode', updatedDarkMode.toString())
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}
