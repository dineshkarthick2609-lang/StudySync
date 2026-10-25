import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null)
  const firstFocusRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    // Focus first focusable element when modal opens
    const timer = setTimeout(() => {
      if (firstFocusRef.current) {
        firstFocusRef.current.focus()
      }
    }, 50)

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      // Trap focus within modal
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(74, 79, 94, 0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-lg"
        style={{
          backgroundColor: 'var(--neu-bg)',
          borderRadius: '20px',
          boxShadow: '8px 8px 20px #b8bec7, -8px -8px 20px #ffffff',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(184,190,199,0.4)' }}
        >
          <h2
            id="modal-title"
            className="text-lg font-semibold"
            style={{ color: 'var(--neu-text)' }}
          >
            {title}
          </h2>
          <button
            ref={firstFocusRef}
            onClick={onClose}
            className="neu-btn p-2"
            aria-label="Close modal"
            style={{ padding: '0.375rem' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
