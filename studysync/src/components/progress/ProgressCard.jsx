import React from 'react'
import ProgressBar from '../common/ProgressBar.jsx'
import Badge from '../common/Badge.jsx'
import { calcProgress, calcTotalStudyMinutes, formatStudyDuration } from '../../utils/progressUtils.js'
import { useAppContext } from '../../context/AppContext.jsx'

export default function ProgressCard({ subject }) {
  const { assignments, sessions } = useAppContext()

  const subjectAssignments = assignments.filter(a => a.subjectId === subject.id)
  const subjectSessions = sessions.filter(s => s.subjectId === subject.id)

  const totalAssignments = subjectAssignments.length
  const completedAssignments = subjectAssignments.filter(a => a.status === 'done').length
  const progress = calcProgress(completedAssignments, totalAssignments)
  const totalMinutes = calcTotalStudyMinutes(subjectSessions)
  const isComplete = totalAssignments > 0 && progress === 100

  return (
    <div
      className="neu-card flex flex-col gap-4"
      style={{ borderTop: `4px solid ${subject.color}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: subject.color,
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
          <h3 className="font-semibold text-base" style={{ color: 'var(--neu-text)' }}>
            {subject.name}
          </h3>
        </div>
        {isComplete && (
          <Badge
            label="Complete"
            color="var(--neu-success)"
          />
        )}
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm" style={{ color: 'var(--neu-text-light)' }}>
            {completedAssignments} / {totalAssignments} assignments
          </span>
          <span className="text-sm font-semibold" style={{ color: 'var(--neu-text)' }}>
            {progress}%
          </span>
        </div>
        <ProgressBar value={progress} color={subject.color} />
      </div>

      {/* Study stats */}
      <div className="flex gap-6 text-sm">
        <div>
          <p className="text-xs mb-0.5" style={{ color: 'var(--neu-text-light)' }}>
            Study Sessions
          </p>
          <p className="font-semibold" style={{ color: 'var(--neu-text)' }}>
            {subjectSessions.length}
          </p>
        </div>
        <div>
          <p className="text-xs mb-0.5" style={{ color: 'var(--neu-text-light)' }}>
            Total Study Time
          </p>
          <p className="font-semibold" style={{ color: 'var(--neu-text)' }}>
            {formatStudyDuration(totalMinutes)}
          </p>
        </div>
      </div>
    </div>
  )
}
