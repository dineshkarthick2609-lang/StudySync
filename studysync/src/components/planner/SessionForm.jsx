import React, { useState } from 'react'
import Input from '../common/Input.jsx'
import Select from '../common/Select.jsx'
import Textarea from '../common/Textarea.jsx'
import Button from '../common/Button.jsx'
import { validateSession } from '../../utils/validators.js'
import { sessionsOverlap } from '../../utils/dateUtils.js'
import { useAppContext } from '../../context/AppContext.jsx'

export default function SessionForm({ initial = {}, editingId = null, onSuccess }) {
  const { subjects, sessions } = useAppContext()

  const today = new Date().toISOString().slice(0, 10)

  const [form, setForm] = useState({
    subjectId: initial.subjectId || '',
    date: initial.date || today,
    startTime: initial.startTime || '09:00',
    endTime: initial.endTime || '10:00',
    notes: initial.notes || '',
  })
  const [errors, setErrors] = useState({})
  const [overlapWarning, setOverlapWarning] = useState('')

  const subjectOptions = subjects.map(s => ({ value: s.id, label: s.name }))

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function checkOverlap(updatedForm) {
    const others = sessions.filter(s => s.id !== editingId)
    const overlappingSession = others.find(s => sessionsOverlap(updatedForm, s))
    if (overlappingSession) {
      const sub = subjects.find(s => s.id === overlappingSession.subjectId)
      setOverlapWarning(
        `This session overlaps with an existing session${sub ? ` for ${sub.name}` : ''}.`
      )
    } else {
      setOverlapWarning('')
    }
  }

  function handleTimeChange(e) {
    const { name, value } = e.target
    const updated = { ...form, [name]: value }
    setForm(updated)
    setErrors(prev => ({ ...prev, [name]: undefined, endTime: undefined }))
    if (updated.date && updated.startTime && updated.endTime) {
      checkOverlap(updated)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const { valid, errors: errs } = validateSession(form, sessions, editingId)
    if (!valid) {
      setErrors(errs)
      return
    }
    onSuccess({
      subjectId: form.subjectId,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      notes: form.notes.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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
        label="Date"
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        error={errors.date}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Time"
          name="startTime"
          type="time"
          value={form.startTime}
          onChange={handleTimeChange}
          error={errors.startTime}
          required
        />
        <Input
          label="End Time"
          name="endTime"
          type="time"
          value={form.endTime}
          onChange={handleTimeChange}
          error={errors.endTime}
          required
        />
      </div>

      {overlapWarning && (
        <div
          className="text-sm px-3 py-2 rounded-lg"
          style={{
            backgroundColor: 'rgba(224,168,124,0.15)',
            color: 'var(--neu-warning)',
            border: '1px solid rgba(224,168,124,0.4)',
          }}
          role="alert"
        >
          ⚠ {overlapWarning}
        </div>
      )}

      <Textarea
        label="Notes (optional)"
        value={form.notes}
        onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
        maxLength={300}
        placeholder="What will you study?"
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" variant="primary">
          {editingId ? 'Save Changes' : 'Add Session'}
        </Button>
      </div>
    </form>
  )
}
