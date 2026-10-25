import React from 'react'
import { useAppContext } from '../../context/AppContext.jsx'
import { formatDuration } from '../../utils/dateUtils.js'

export default function TodaysSessions() {
  const { sessions, subjects } = useAppContext()

  const today = new Date().toISOString().slice(0, 10)
  const todaySessions = sessions
    .filter(s => s.date === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <div className="neu-card">
      <h3 className="font-semibold text-base mb-4" style={{ color: 'var(--neu-text)' }}>
        Today&apos;s Sessions
      </h3>
      {todaySessions.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--neu-text-light)' }}>
          No study sessions planned for today.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {todaySessions.map(s => {
            const subject = subjects.find(sub => sub.id === s.subjectId)
            const [sh, sm] = s.startTime.split(':').map(Number)
            const [eh, em] = s.endTime.split(':').map(Number)
            const mins = (eh * 60 + em) - (sh * 60 + sm)
            return (
              <div
                key={s.id}
                className="flex items-center gap-3 py-2"
                style={{ borderBottom: '1px solid rgba(184,190,199,0.3)' }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '36px',
                    borderRadius: '4px',
                    backgroundColor: subject?.color || 'var(--neu-accent)',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--neu-text)' }}>
                    {subject?.name || 'Unknown'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--neu-text-light)' }}>
                    {s.startTime} – {s.endTime} · {formatDuration(mins)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
