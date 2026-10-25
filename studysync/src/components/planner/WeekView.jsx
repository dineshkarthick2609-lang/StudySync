import React from 'react'
import SessionCard from './SessionCard.jsx'
import { filterSessionsByWeek, formatDuration } from '../../utils/dateUtils.js'
import { calcTotalStudyMinutes } from '../../utils/progressUtils.js'

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function getDayDates(monday) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

export default function WeekView({ sessions, monday, sunday, onEdit, onDelete }) {
  const weekSessions = filterSessionsByWeek(sessions, monday, sunday)
  const dayDates = getDayDates(monday)

  return (
    <div className="flex flex-col gap-6">
      {dayDates.map((dateStr, idx) => {
        const daySessions = weekSessions
          .filter(s => s.date === dateStr)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))

        const totalMinutes = calcTotalStudyMinutes(daySessions)

        return (
          <div key={dateStr}>
            {/* Day header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-base" style={{ color: 'var(--neu-text)' }}>
                {DAY_NAMES[idx]}
                <span
                  className="ml-2 text-sm font-normal"
                  style={{ color: 'var(--neu-text-light)' }}
                >
                  {new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </h3>
              {daySessions.length > 0 && (
                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--neu-accent)' }}
                >
                  {formatDuration(totalMinutes)} total
                </span>
              )}
            </div>

            {daySessions.length === 0 ? (
              <div
                className="text-sm py-3 px-4 rounded-xl"
                style={{
                  color: 'var(--neu-text-light)',
                  backgroundColor: 'rgba(184,190,199,0.15)',
                }}
              >
                No sessions
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {daySessions.map(session => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
