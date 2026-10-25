import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button.jsx'
import Modal from '../components/common/Modal.jsx'
import SubjectList from '../components/subjects/SubjectList.jsx'
import SubjectForm from '../components/subjects/SubjectForm.jsx'
import { useAppContext } from '../context/AppContext.jsx'

export default function SubjectsPage() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useAppContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  function handleAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function handleEdit(subject) {
    setEditing(subject)
    setModalOpen(true)
  }

  function handleDelete(id) {
    if (window.confirm('Delete this subject? All its assignments and sessions will also be removed.')) {
      deleteSubject(id)
    }
  }

  function handleSuccess(data) {
    if (editing) {
      updateSubject(editing.id, data)
    } else {
      addSubject(data)
    }
    setModalOpen(false)
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--neu-text)' }}>
            Subjects
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--neu-text-light)' }}>
            {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="primary" onClick={handleAdd}>
          <Plus size={16} /> Add Subject
        </Button>
      </div>

      <SubjectList
        subjects={subjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Subject' : 'Add Subject'}
      >
        <SubjectForm
          initial={editing || {}}
          editingId={editing?.id}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  )
}
