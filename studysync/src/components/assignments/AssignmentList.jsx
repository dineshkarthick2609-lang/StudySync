import React from 'react'
import { ClipboardList } from 'lucide-react'
import AssignmentCard from './AssignmentCard.jsx'
import EmptyState from '../common/EmptyState.jsx'

export default function AssignmentList({ assignments, onEdit, onDelete, onStatusChange }) {
  if (!assignments || assignments.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        heading="No assignments found"
        subtext="Add an assignment or adjust your filters."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {assignments.map(assignment => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}
