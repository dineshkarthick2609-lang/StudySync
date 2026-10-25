import React from 'react'
import { ClipboardList } from 'lucide-react'
import { useAppContext } from '../../context/AppContext.jsx'
import { getWeekBounds, isOverdue, formatDate } from '../../utils/dateUtils.js'
import Badge from '../common/Badge.jsx'
import EmptyState from '../common/EmptyState.jsx'

export default function DueThisWeek() {
  const { assignments, subjects } = useAppContext()

  const { monday, sunday } = getWeekBounds(new Date())
  const monStr = monday.toISOString().slice(0, 10)
  const sunStr = sunday.toISOString().slice(0, 10)

  const dueThisWeek = assignments
    .filter(a => a.dueDate >= monStr && a.dueDate <= sunStr && a.status !== 'done')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  return (
    <div className="neu-card">
      <h3 className="font-semibold text-base mb-4" style={{ color: 'var(--neu-text)' }}>
        Due This Week
      </h3>
      {dueThisWeek.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--neu-text-light)' }}>
          Nothing due this week 🎉
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {dueThisWeek.map(a => {
            const subject = subjects.find(s => s.id === a.subjectId)
            const overdue = isOverdue(a)
            return (
              <div
                key={a.id}
                className="flex items-center justify-between gap-2 py-2"
                style={{
                  borderBottom: '1px solid rgba(184,190,199,0.3)',
                  color: overdue ? 'var(--neu-danger)' : 'var(--neu-text)',
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--neu-text-light)' }}>
                    {formatDate(a.dueDate)} {overdue && '· Overdue'}
                  </p>
                </div>
                {subject && (
                  <Badge label={subject.name} color={subject.color} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
