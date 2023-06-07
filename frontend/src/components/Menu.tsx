import type React from 'react'
import { useContext, useEffect, useRef, useState } from 'react'
import { TbBookmark, TbLogin, TbLogout, TbMenu2, TbPencil, TbUserCircle } from 'react-icons/tb'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { queryClient } from '../hooks/useQueryClient'
import useAppointmentStore from '../store/useAppointmentStore'
import axiosInstance from '../utils/api'

const MenuItem: React.FC<{ onClick?: () => Promise<void>; icon: JSX.Element; text: string }> = ({
  onClick,
  icon,
  text
}) => (
  <button
    className="flex items-center space-x-2 p-2 color-hover hover:rounded-md w-full"
    onClick={onClick}>
    {icon}
    <p>{text}</p>
  </button>
)

const Menu: React.FC<{ isAuthenticated: boolean }> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { reset } = useAppointmentStore()
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axiosInstance.post(`/auth/logout`)
      queryClient.clear()
      reset()
      navigate('/')
      window.location.reload()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const { data: authStatus } = useContext(AuthContext)
  const username = authStatus?.data?.username ?? authStatus?.data?.displayName
  return (
    <div className="relative text-left" ref={selectRef} onClick={toggleDropdown}>
      <div className="rounded-full color-border p-2">
        <button type="button" className="flex items-center space-x-2 focus:outline-none">
          {authStatus.isAuthenticated ? (
            <img src={authStatus?.data?.profilePicture} className="rounded-full h-6" />
          ) : (
            <TbUserCircle />
          )}
          {authStatus.isAuthenticated && <span>Hello, {username}!</span>}
          <TbMenu2 />
        </button>
      </div>
      {isOpen && (
        <div className="color-component-secondary origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {authStatus.isAuthenticated ? (
            <div role="menu" aria-orientation="vertical" aria-labelledby="header-dropdown">
              <NavLink to={'/appointments'}>
                <MenuItem icon={<TbBookmark />} text="My Appointments" />
              </NavLink>
              <MenuItem onClick={handleLogout} icon={<TbLogout />} text="Log Out" />
            </div>
          ) : (
            <div role="menu" aria-orientation="vertical" aria-labelledby="header-dropdown">
              <NavLink to={'/login'}>
                <MenuItem icon={<TbLogin />} text="Log in" />
              </NavLink>
              <NavLink to={'/register'}>
                <MenuItem icon={<TbPencil />} text="Sign up" />
              </NavLink>{' '}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Menu
