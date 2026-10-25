import React, { useState } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import Button from '../components/common/Button.jsx'
import Modal from '../components/common/Modal.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import AssignmentFilters from '../components/assignments/AssignmentFilters.jsx'
import AssignmentList from '../components/assignments/AssignmentList.jsx'
import AssignmentForm from '../components/assignments/AssignmentForm.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { filterAssignments } from '../utils/assignmentUtils.js'

const defaultFilters = { subjectId: '', statuses: [], priorities: [] }

export default function AssignmentsPage() {
  const { subjects, assignments, addAssignment, updateAssignment, deleteAssignment } =
    useAppContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filters, setFilters] = useState(defaultFilters)

  const filtered = filterAssignments(assignments, filters)

  function handleAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function handleEdit(assignment) {
    setEditing(assignment)
    setModalOpen(true)
  }

  function handleDelete(id) {
    if (window.confirm('Delete this assignment?')) {
      deleteAssignment(id)
    }
  }

  function handleStatusChange(id, status) {
    updateAssignment(id, { status })
  }

  function handleSuccess(data) {
    if (editing) {
      updateAssignment(editing.id, data)
    } else {
      addAssignment(data)
    }
    setModalOpen(false)
  }

  if (subjects.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        heading="No subjects yet"
        subtext="You need at least one subject before adding assignments."
        action={
          <a
            href="/subjects"
            className="neu-btn-accent"
            style={{ textDecoration: 'none' }}
          >
            Go to Subjects
          </a>
        }
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--neu-text)' }}>
            Assignments
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--neu-text-light)' }}>
            {filtered.length} of {assignments.length} assignments
          </p>
        </div>
        <Button variant="primary" onClick={handleAdd}>
          <Plus size={16} /> Add Assignment
        </Button>
      </div>

      <AssignmentFilters filters={filters} onChange={setFilters} />
      <AssignmentList
        assignments={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Assignment' : 'Add Assignment'}
      >
        <AssignmentForm
          initial={editing || {}}
          editingId={editing?.id}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  )
}
