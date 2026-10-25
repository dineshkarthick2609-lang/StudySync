import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../common/Input.jsx'
import Button from '../common/Button.jsx'
import { readStore, writeStore } from '../../utils/storage.js'

export default function LoginForm({ onSwitchToSignup }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.username.trim() || !form.password) {
      setError('All fields are required.')
      return
    }

    const users = readStore('studysync_users', [])
    const user = users.find(
      u => u.username === form.username && u.password === form.password
    )

    if (!user) {
      setError('Invalid username or password.')
      return
    }

    writeStore('studysync_session', {
      username: user.username,
      name: user.name,
      loggedInAt: new Date().toISOString(),
    })
    navigate('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Enter your username"
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Enter your password"
        required
      />

      {error && (
        <p
          className="text-sm text-center"
          style={{ color: 'var(--neu-danger)' }}
          role="alert"
        >
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" className="w-full justify-center mt-2">
        Login
      </Button>

      <p
        className="text-sm text-center"
        style={{ color: 'var(--neu-text-light)' }}
      >
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="underline font-medium"
          style={{ color: 'var(--neu-accent)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Create account
        </button>
      </p>
    </form>
  )
}
