import React from 'react'
import { getTimeOfDay } from '../../utils/dateUtils.js'
import { useAppContext } from '../../context/AppContext.jsx'

export default function GreetingBanner() {
  const { user } = useAppContext()
  const timeOfDay = getTimeOfDay()
  const name = user?.name || 'Student'

  return (
    <div className="neu-card mb-6">
      <h2 className="text-xl font-semibold" style={{ color: 'var(--neu-text)' }}>
        Good {timeOfDay},{' '}
        <span style={{ color: 'var(--neu-accent)' }}>{name}</span>!
      </h2>
      <p className="text-sm mt-1" style={{ color: 'var(--neu-text-light)' }}>
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
    </div>
  )
}
