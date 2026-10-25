import React from 'react'
import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const routeTitles = {
  '/dashboard': 'Dashboard',
  '/subjects': 'Subjects',
  '/assignments': 'Assignments',
  '/planner': 'Study Planner',
  '/progress': 'Progress',
}

export default function TopBar({ onMenuClick }) {
  const { pathname } = useLocation()
  const title = routeTitles[pathname] || 'StudySync'

  return (
    <header
      className="flex items-center gap-4 px-4 py-3 md:hidden"
      style={{
        backgroundColor: 'var(--neu-bg)',
        boxShadow: '0 2px 8px #b8bec7',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <button
        className="neu-btn p-2"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        style={{ padding: '0.5rem' }}
      >
        <Menu size={20} />
      </button>
      <h1 className="text-lg font-semibold" style={{ color: 'var(--neu-text)' }}>
        {title}
      </h1>
    </header>
  )
}
