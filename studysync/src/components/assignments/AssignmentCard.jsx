import React from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import { isOverdue, formatDate } from '../../utils/dateUtils.js'
import { useAppContext } from '../../context/AppContext.jsx'

const priorityColors = {
  low: '#6db88b',
  medium: '#e0a87c',
  high: '#e07c7c',
}

const statusColors = {
  todo: '#8a9bb5',
  'in-progress': '#6c9bcf',
  done: '#6db88b',
}

const statusLabels = {
  todo: 'To-do',
  'in-progress': 'In Progress',
  done: 'Done',
}

export default function AssignmentCard({ assignment, onEdit, onDelete, onStatusChange }) {
  const { subjects } = useAppContext()
  const subject = subjects.find(s => s.id === assignment.subjectId)
  const overdue = isOverdue(assignment)

  return (
    <div
      className="neu-card flex flex-col gap-3"
      style={{
        borderLeft: overdue ? `4px solid var(--neu-danger)` : `4px solid ${subject?.color || 'transparent'}`,
      }}
    >
      {/* Title + actions */}
      <div className="flex items-start justify-between gap-2">
        <h3
          className="font-semibold text-base flex-1"
          style={{
            color: overdue ? 'var(--neu-danger)' : 'var(--neu-text)',
            textDecoration: assignment.status === 'done' ? 'line-through' : 'none',
          }}
        >
          {assignment.title}
        </h3>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(assignment)}
            className="neu-btn p-1.5"
            aria-label={`Edit ${assignment.title}`}
            style={{ padding: '0.375rem' }}
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(assignment.id)}
            className="neu-btn p-1.5"
            aria-label={`Delete ${assignment.title}`}
            style={{ padding: '0.375rem', color: 'var(--neu-danger)' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Subject badge + due date */}
      <div className="flex items-center gap-2 flex-wrap">
        {subject && (
          <Badge label={subject.name} color={subject.color} />
        )}
        <span className="text-xs" style={{ color: overdue ? 'var(--neu-danger)' : 'var(--neu-text-light)' }}>
          Due: {formatDate(assignment.dueDate)}
          {overdue && ' · Overdue'}
        </span>
      </div>

      {/* Priority + status */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          label={assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
          color={priorityColors[assignment.priority] || '#8a9bb5'}
        />
        <select
          value={assignment.status}
          onChange={e => onStatusChange && onStatusChange(assignment.id, e.target.value)}
          className="text-xs px-2 py-0.5 rounded-full font-medium border-none cursor-pointer"
          style={{
            backgroundColor: statusColors[assignment.status] || '#8a9bb5',
            color: '#fff',
            appearance: 'auto',
          }}
          aria-label="Assignment status"
        >
          <option value="todo">To-do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Notes */}
      {assignment.notes && (
        <p className="text-xs" style={{ color: 'var(--neu-text-light)' }}>
          {assignment.notes}
        </p>
      )}
    </div>
  )
}
