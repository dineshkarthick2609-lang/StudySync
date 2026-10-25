import React, { useState } from 'react'
import Input from '../common/Input.jsx'
import Textarea from '../common/Textarea.jsx'
import ColorPicker from '../common/ColorPicker.jsx'
import Button from '../common/Button.jsx'
import { validateSubject } from '../../utils/validators.js'
import { useAppContext } from '../../context/AppContext.jsx'

export default function SubjectForm({ initial = {}, editingId = null, onSuccess }) {
  const { subjects } = useAppContext()
  const [form, setForm] = useState({
    name: initial.name || '',
    color: initial.color || '',
    description: initial.description || '',
  })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const { valid, errors: errs } = validateSubject(form, subjects, editingId)
    if (!valid) {
      setErrors(errs)
      return
    }
    onSuccess({
      name: form.name.trim(),
      color: form.color,
      description: form.description.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Subject Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="e.g. Mathematics"
        required
      />

      <div>
        <label className="text-sm font-medium block mb-2" style={{ color: 'var(--neu-text)' }}>
          Color <span className="ml-1 text-red-400">*</span>
        </label>
        <ColorPicker
          value={form.color}
          onChange={color => {
            setForm(prev => ({ ...prev, color }))
            setErrors(prev => ({ ...prev, color: undefined }))
          }}
          error={errors.color}
        />
      </div>

      <Textarea
        label="Description (optional)"
        value={form.description}
        onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
        maxLength={200}
        placeholder="Brief description of this subject"
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" variant="primary">
          {editingId ? 'Save Changes' : 'Add Subject'}
        </Button>
      </div>
    </form>
  )
}
