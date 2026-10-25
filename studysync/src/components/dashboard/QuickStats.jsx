import React from 'react'
import { BookOpen, ClipboardList, Clock } from 'lucide-react'
import { useAppContext } from '../../context/AppContext.jsx'
import { getWeekBounds, filterSessionsByWeek } from '../../utils/dateUtils.js'
import { calcTotalStudyMinutes, formatStudyDuration } from '../../utils/progressUtils.js'

export default function QuickStats() {
  const { subjects, assignments, sessions } = useAppContext()

  const pendingCount = assignments.filter(a => a.status !== 'done').length

  const { monday, sunday } = getWeekBounds(new Date())
  const thisWeekSessions = filterSessionsByWeek(sessions, monday, sunday)
  const weekMinutes = calcTotalStudyMinutes(thisWeekSessions)

  const stats = [
    {
      icon: BookOpen,
      label: 'Subjects',
      value: subjects.length,
      color: 'var(--neu-accent)',
    },
    {
      icon: ClipboardList,
      label: 'Pending',
      value: pendingCount,
      color: 'var(--neu-warning)',
    },
    {
      icon: Clock,
      label: 'This Week',
      value: formatStudyDuration(weekMinutes),
      color: 'var(--neu-success)',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="neu-card flex flex-col items-center gap-1 py-4">
          <Icon size={20} style={{ color }} />
          <p className="text-lg font-bold" style={{ color: 'var(--neu-text)' }}>
            {value}
          </p>
          <p className="text-xs" style={{ color: 'var(--neu-text-light)' }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}
