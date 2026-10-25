import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import Input from '../common/Input.jsx'
import Button from '../common/Button.jsx'
import { readStore, writeStore } from '../../utils/storage.js'

export default function SignupForm({ onSwitchToLogin }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', password: '' })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: undefined, general: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}

    if (!form.name.trim() || !form.username.trim() || !form.password) {
      if (!form.name.trim()) newErrors.name = 'All fields are required.'
      if (!form.username.trim()) newErrors.username = 'All fields are required.'
      if (!form.password) newErrors.password = 'All fields are required.'
      setErrors(newErrors)
      return
    }

    if (form.password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters.' })
      return
    }

    const users = readStore('studysync_users', [])
    const duplicate = users.some(
      u => u.username.toLowerCase() === form.username.toLowerCase()
    )
    if (duplicate) {
      setErrors({ username: 'Username already taken.' })
      return
    }

    const newUser = {
      id: uuidv4(),
      name: form.name.trim(),
      username: form.username.trim(),
      password: form.password,
      createdAt: new Date().toISOString(),
    }
    writeStore('studysync_users', [...users, newUser])
    writeStore('studysync_session', {
      username: newUser.username,
      name: newUser.name,
      loggedInAt: new Date().toISOString(),
    })
    navigate('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Full Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Your full name"
        required
      />
      <Input
        label="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
        error={errors.username}
        placeholder="Choose a username"
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="At least 6 characters"
        required
      />

      {errors.general && (
        <p
          className="text-sm text-center"
          style={{ color: 'var(--neu-danger)' }}
          role="alert"
        >
          {errors.general}
        </p>
      )}

      <Button type="submit" variant="primary" className="w-full justify-center mt-2">
        Create Account
      </Button>

      <p
        className="text-sm text-center"
        style={{ color: 'var(--neu-text-light)' }}
      >
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="underline font-medium"
          style={{ color: 'var(--neu-accent)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Log in
        </button>
      </p>
    </form>
  )
}
