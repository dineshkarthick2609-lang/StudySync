import React, { useState } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import Button from '../components/common/Button.jsx'
import Modal from '../components/common/Modal.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import WeekNavigation from '../components/planner/WeekNavigation.jsx'
import WeekView from '../components/planner/WeekView.jsx'
import SessionForm from '../components/planner/SessionForm.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { getWeekBounds } from '../utils/dateUtils.js'

export default function PlannerPage() {
  const { subjects, sessions, addSession, updateSession, deleteSession } = useAppContext()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const { monday, sunday } = getWeekBounds(currentDate)

  function goToPrevWeek() {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - 7)
    setCurrentDate(d)
  }

  function goToNextWeek() {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + 7)
    setCurrentDate(d)
  }

  function handleAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function handleEdit(session) {
    setEditing(session)
    setModalOpen(true)
  }

  function handleDelete(id) {
    if (window.confirm('Delete this study session?')) {
      deleteSession(id)
    }
  }

  function handleSuccess(data) {
    if (editing) {
      updateSession(editing.id, data)
    } else {
      addSession(data)
    }
    setModalOpen(false)
  }

  if (subjects.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        heading="No subjects yet"
        subtext="Add a subject before planning study sessions."
        action={
          <a href="/subjects" className="neu-btn-accent" style={{ textDecoration: 'none' }}>
            Go to Subjects
          </a>
        }
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--neu-text)' }}>
          Study Planner
        </h1>
        <Button variant="primary" onClick={handleAdd}>
          <Plus size={16} /> Add Session
        </Button>
      </div>

      <WeekNavigation
        monday={monday}
        sunday={sunday}
        onPrev={goToPrevWeek}
        onNext={goToNextWeek}
      />

      <WeekView
        sessions={sessions}
        monday={monday}
        sunday={sunday}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Session' : 'Add Study Session'}
      >
        <SessionForm
          initial={editing || {}}
          editingId={editing?.id}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  )
}
