import React, { useState } from 'react'
import { BookOpen } from 'lucide-react'
import LoginForm from '../components/auth/LoginForm.jsx'
import SignupForm from '../components/auth/SignupForm.jsx'

export default function AuthPage({ defaultTab = 'login' }) {
  const [tab, setTab] = useState(defaultTab)

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--neu-bg)' }}
    >
      <div
        className="w-full max-w-md neu-card"
        style={{ borderRadius: '24px' }}
      >
        {/* Brand */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="neu-card-sm inline-flex mb-3"
            style={{ padding: '0.75rem', borderRadius: '16px' }}
          >
            <BookOpen size={28} style={{ color: 'var(--neu-accent)' }} />
          </div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--neu-text)' }}>
            StudySync
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--neu-text-light)' }}>
            Your academic companion
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex rounded-xl mb-6 p-1"
          style={{ backgroundColor: 'var(--neu-bg)', boxShadow: 'var(--shadow-inset)' }}
        >
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === 'login' ? 'neu-btn-accent' : ''
            }`}
            style={{
              color: tab === 'login' ? '#fff' : 'var(--neu-text-light)',
              background: tab === 'login' ? 'var(--neu-accent)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all`}
            style={{
              color: tab === 'signup' ? '#fff' : 'var(--neu-text-light)',
              background: tab === 'signup' ? 'var(--neu-accent)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Sign Up
          </button>
        </div>

        {tab === 'login' ? (
          <LoginForm onSwitchToSignup={() => setTab('signup')} />
        ) : (
          <SignupForm onSwitchToLogin={() => setTab('login')} />
        )}
      </div>
    </div>
  )
}
