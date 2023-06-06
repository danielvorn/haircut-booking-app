import type React from 'react'
import { useContext } from 'react'
import { FcCalendar } from 'react-icons/fc'
import { TbMoon, TbSunHigh } from 'react-icons/tb'
import { NavLink } from 'react-router-dom'
import Menu from '../components/Menu'
import { DarkModeContext } from '../context/DarkModeContext'

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext)

  return (
    <header className="color-primary shadow-md py-4 px-8 z-50">
      <div className="flex justify-between items-center">
        <NavLink to={'/'}>
          <div className="flex items-center space-x-2">
            <FcCalendar />
            <h1 className="text-xl font-bold">Haircut Booking App</h1>
          </div>
        </NavLink>
        <div className="flex items-center space-x-3 font-bold">
          <div className="flex items-center">
            {isDarkMode ? (
              <TbMoon onClick={toggleDarkMode} />
            ) : (
              <TbSunHigh onClick={toggleDarkMode} />
            )}
          </div>
          <Menu isAuthenticated={false} />
        </div>
      </div>
    </header>
  )
}

export default Header
