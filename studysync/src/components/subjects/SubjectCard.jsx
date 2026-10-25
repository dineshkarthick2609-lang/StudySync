import React from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { useAppContext } from '../../context/AppContext.jsx'

export default function SubjectCard({ subject, onEdit, onDelete }) {
  const { assignments } = useAppContext()

  const subjectAssignments = assignments.filter(a => a.subjectId === subject.id)
  const completedCount = subjectAssignments.filter(a => a.status === 'done').length
  const totalCount = subjectAssignments.length

  const truncatedDesc =
    subject.description && subject.description.length > 80
      ? subject.description.slice(0, 80) + '…'
      : subject.description

  return (
    <div className="neu-card flex flex-col gap-3">
      {/* Color bar + name */}
      <div className="flex items-center gap-3">
        <div
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: subject.color,
            flexShrink: 0,
            boxShadow: 'var(--shadow-raised-sm)',
          }}
          aria-hidden="true"
        />
        <h3 className="font-semibold text-base flex-1 truncate" style={{ color: 'var(--neu-text)' }}>
          {subject.name}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(subject)}
            className="neu-btn p-1.5"
            aria-label={`Edit ${subject.name}`}
            style={{ padding: '0.375rem' }}
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(subject.id)}
            className="neu-btn p-1.5"
            aria-label={`Delete ${subject.name}`}
            style={{ padding: '0.375rem', color: 'var(--neu-danger)' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Description */}
      {truncatedDesc && (
        <p className="text-sm" style={{ color: 'var(--neu-text-light)' }}>
          {truncatedDesc}
        </p>
      )}

      {/* Assignment count */}
      <div
        className="text-xs font-medium"
        style={{ color: 'var(--neu-text-light)' }}
      >
        {completedCount} / {totalCount} assignments completed
      </div>
    </div>
  )
}
