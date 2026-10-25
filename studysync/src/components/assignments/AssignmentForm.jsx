import React, { useState } from 'react'
import Input from '../common/Input.jsx'
import Select from '../common/Select.jsx'
import Textarea from '../common/Textarea.jsx'
import Button from '../common/Button.jsx'
import { validateAssignment } from '../../utils/validators.js'
import { useAppContext } from '../../context/AppContext.jsx'

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const statusOptions = [
  { value: 'todo', label: 'To-do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

export default function AssignmentForm({ initial = {}, editingId = null, onSuccess, onCancel }) {
  const { subjects } = useAppContext()

  const today = new Date().toISOString().slice(0, 10)

  const [form, setForm] = useState({
    title: initial.title || '',
    subjectId: initial.subjectId || '',
    dueDate: initial.dueDate || today,
    priority: initial.priority || 'medium',
    status: initial.status || 'todo',
    notes: initial.notes || '',
  })
  const [errors, setErrors] = useState({})

  const subjectOptions = subjects.map(s => ({ value: s.id, label: s.name }))

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const { valid, errors: errs } = validateAssignment(form)
    if (!valid) {
      setErrors(errs)
      return
    }
    onSuccess({
      title: form.title.trim(),
      subjectId: form.subjectId,
      dueDate: form.dueDate,
      priority: form.priority,
      status: form.status,
      notes: form.notes.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Assignment title"
        required
      />

      <Select
        label="Subject"
        name="subjectId"
        value={form.subjectId}
        onChange={handleChange}
        options={subjectOptions}
        error={errors.subjectId}
        placeholder="Select a subject"
        required
      />

      <Input
        label="Due Date"
        name="dueDate"
        type="date"
        value={form.dueDate}
        onChange={handleChange}
        error={errors.dueDate}
        min={editingId ? undefined : today}
        required
      />

      <Select
        label="Priority"
        name="priority"
        value={form.priority}
        onChange={handleChange}
        options={priorityOptions}
        error={errors.priority}
        required
      />

      <Select
        label="Status"
        name="status"
        value={form.status}
        onChange={handleChange}
        options={statusOptions}
        error={errors.status}
        required
      />

      <Textarea
        label="Notes (optional)"
        value={form.notes}
        onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
        maxLength={500}
        placeholder="Any additional notes"
      />

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary">
          {editingId ? 'Save Changes' : 'Add Assignment'}
        </Button>
      </div>
    </form>
  )
}
