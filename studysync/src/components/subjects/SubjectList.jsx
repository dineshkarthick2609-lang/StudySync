import React from 'react'
import { BookOpen } from 'lucide-react'
import SubjectCard from './SubjectCard.jsx'
import EmptyState from '../common/EmptyState.jsx'

export default function SubjectList({ subjects, onEdit, onDelete }) {
  if (!subjects || subjects.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        heading="No subjects yet"
        subtext="Add your first subject to get started."
      />
    )
  }

  const sorted = [...subjects].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map(subject => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
