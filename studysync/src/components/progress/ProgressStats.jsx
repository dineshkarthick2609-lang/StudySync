import React from 'react'
import { useAppContext } from '../../context/AppContext.jsx'
import { calcTotalStudyMinutes, formatStudyDuration } from '../../utils/progressUtils.js'

export default function ProgressStats() {
  const { subjects, assignments, sessions } = useAppContext()

  const pendingCount = assignments.filter(a => a.status !== 'done').length
  const totalMinutes = calcTotalStudyMinutes(sessions)

  return (
    <div className="neu-card mb-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
      <div>
        <p className="text-xs mb-1" style={{ color: 'var(--neu-text-light)' }}>Total Subjects</p>
        <p className="text-2xl font-bold" style={{ color: 'var(--neu-text)' }}>{subjects.length}</p>
      </div>
      <div>
        <p className="text-xs mb-1" style={{ color: 'var(--neu-text-light)' }}>Total Assignments</p>
        <p className="text-2xl font-bold" style={{ color: 'var(--neu-text)' }}>{assignments.length}</p>
      </div>
      <div>
        <p className="text-xs mb-1" style={{ color: 'var(--neu-text-light)' }}>Pending</p>
        <p className="text-2xl font-bold" style={{ color: 'var(--neu-warning)' }}>{pendingCount}</p>
      </div>
      <div>
        <p className="text-xs mb-1" style={{ color: 'var(--neu-text-light)' }}>Total Study Time</p>
        <p className="text-2xl font-bold" style={{ color: 'var(--neu-accent)' }}>
          {formatStudyDuration(totalMinutes)}
        </p>
      </div>
    </div>
  )
}
