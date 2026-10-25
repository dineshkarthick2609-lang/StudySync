import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Calendar,
  TrendingUp,
  LogOut,
  X,
} from 'lucide-react'
import { useAppContext } from '../../context/AppContext.jsx'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/assignments', label: 'Assignments', icon: ClipboardList },
  { to: '/planner', label: 'Planner', icon: Calendar },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAppContext()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ backgroundColor: 'rgba(74,79,94,0.4)', backdropFilter: 'blur(2px)' }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`neu-sidebar fixed left-0 top-0 h-full z-40 flex flex-col transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Logo / Brand */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid rgba(184,190,199,0.4)' }}
        >
          <div className="flex items-center gap-2">
            <BookOpen size={22} style={{ color: 'var(--neu-accent)' }} />
            <span className="text-lg font-semibold" style={{ color: 'var(--neu-text)' }}>
              StudySync
            </span>
          </div>
          <button
            className="neu-btn md:hidden p-1"
            onClick={onClose}
            aria-label="Close sidebar"
            style={{ padding: '0.25rem' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="px-6 py-4">
            <p className="text-xs" style={{ color: 'var(--neu-text-light)' }}>
              Logged in as
            </p>
            <p className="font-semibold truncate" style={{ color: 'var(--neu-text)' }}>
              {user.name}
            </p>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 px-4 py-2 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white'
                    : ''
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--neu-accent)' : 'transparent',
                color: isActive ? '#fff' : 'var(--neu-text)',
                boxShadow: isActive ? 'var(--shadow-raised-sm)' : 'none',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(184,190,199,0.4)' }}>
          <button
            onClick={handleLogout}
            className="neu-btn w-full justify-start gap-3"
            style={{ width: '100%' }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
