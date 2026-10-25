import React from 'react'
import { Edit2, Trash2, Clock } from 'lucide-react'
import { useAppContext } from '../../context/AppContext.jsx'
import { formatDuration } from '../../utils/dateUtils.js'

function calcMinutes(startTime, endTime) {
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  return (eh * 60 + em) - (sh * 60 + sm)
}

export default function SessionCard({ session, onEdit, onDelete }) {
  const { subjects } = useAppContext()
  const subject = subjects.find(s => s.id === session.subjectId)
  const duration = calcMinutes(session.startTime, session.endTime)

  return (
    <div
      className="neu-card-sm flex flex-col gap-2"
      style={{ borderLeft: `3px solid ${subject?.color || 'var(--neu-accent)'}` }}
    >
      {/* Subject + actions */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-sm" style={{ color: 'var(--neu-text)' }}>
          {subject?.name || 'Unknown Subject'}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(session)}
            className="neu-btn p-1"
            aria-label={`Edit session`}
            style={{ padding: '0.25rem' }}
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => onDelete(session.id)}
            className="neu-btn p-1"
            aria-label={`Delete session`}
            style={{ padding: '0.25rem', color: 'var(--neu-danger)' }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Time range + duration */}
      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--neu-text-light)' }}>
        <Clock size={12} />
        <span>
          {session.startTime} – {session.endTime}
        </span>
        <span className="font-medium" style={{ color: 'var(--neu-accent)' }}>
          {formatDuration(duration)}
        </span>
      </div>

      {/* Notes */}
      {session.notes && (
        <p className="text-xs" style={{ color: 'var(--neu-text-light)' }}>
          {session.notes}
        </p>
      )}
    </div>
  )
}
