import React from 'react'
import { TrendingUp } from 'lucide-react'
import ProgressCard from '../components/progress/ProgressCard.jsx'
import ProgressStats from '../components/progress/ProgressStats.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import { useAppContext } from '../context/AppContext.jsx'

export default function ProgressPage() {
  const { subjects } = useAppContext()

  const sorted = [...subjects].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  )

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6" style={{ color: 'var(--neu-text)' }}>
        Progress
      </h1>

      <ProgressStats />

      {sorted.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          heading="No subjects yet"
          subtext="Add subjects to track your academic progress."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map(subject => (
            <ProgressCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  )
}
