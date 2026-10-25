import React, { useEffect } from 'react'
import { X, AlertCircle } from 'lucide-react'

export default function Toast({ message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [message, onClose, duration])

  if (!message) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{
        backgroundColor: 'var(--neu-bg)',
        boxShadow: 'var(--shadow-raised)',
        color: 'var(--neu-text)',
        maxWidth: '360px',
      }}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle size={18} style={{ color: 'var(--neu-warning)', flexShrink: 0 }} />
      <span className="text-sm flex-1">{message}</span>
      <button
        onClick={onClose}
        className="neu-btn p-1"
        aria-label="Dismiss notification"
        style={{ padding: '0.25rem' }}
      >
        <X size={16} />
      </button>
    </div>
  )
}
