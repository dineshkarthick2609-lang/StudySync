import React from 'react'
import Select from '../common/Select.jsx'
import Button from '../common/Button.jsx'
import { useAppContext } from '../../context/AppContext.jsx'

const statusOptions = [
  { value: 'todo', label: 'To-do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export default function AssignmentFilters({ filters, onChange }) {
  const { subjects } = useAppContext()

  const subjectOptions = [
    { value: '', label: 'All Subjects' },
    ...subjects.map(s => ({ value: s.id, label: s.name })),
  ]

  function handleSubject(e) {
    onChange({ ...filters, subjectId: e.target.value })
  }

  function toggleStatus(value) {
    const cur = filters.statuses || []
    const next = cur.includes(value)
      ? cur.filter(v => v !== value)
      : [...cur, value]
    onChange({ ...filters, statuses: next })
  }

  function togglePriority(value) {
    const cur = filters.priorities || []
    const next = cur.includes(value)
      ? cur.filter(v => v !== value)
      : [...cur, value]
    onChange({ ...filters, priorities: next })
  }

  function clearFilters() {
    onChange({ subjectId: '', statuses: [], priorities: [] })
  }

  const hasFilters =
    filters.subjectId ||
    (filters.statuses && filters.statuses.length > 0) ||
    (filters.priorities && filters.priorities.length > 0)

  return (
    <div className="neu-card mb-6 flex flex-wrap gap-4 items-end">
      {/* Subject filter */}
      <div className="min-w-[180px] flex-1">
        <Select
          label="Subject"
          value={filters.subjectId || ''}
          onChange={handleSubject}
          options={subjectOptions}
        />
      </div>

      {/* Status filter */}
      <div>
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--neu-text)' }}>
          Status
        </p>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(opt => {
            const active = (filters.statuses || []).includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleStatus(opt.value)}
                className={active ? 'neu-btn-accent text-sm' : 'neu-btn text-sm'}
                style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Priority filter */}
      <div>
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--neu-text)' }}>
          Priority
        </p>
        <div className="flex flex-wrap gap-2">
          {priorityOptions.map(opt => {
            const active = (filters.priorities || []).includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => togglePriority(opt.value)}
                className={active ? 'neu-btn-accent text-sm' : 'neu-btn text-sm'}
                style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <Button variant="secondary" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  )
}
