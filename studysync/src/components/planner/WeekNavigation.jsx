import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function WeekNavigation({ monday, sunday, onPrev, onNext }) {
  function formatRange(mon, sun) {
    const opts = { month: 'short', day: 'numeric' }
    const monStr = mon.toLocaleDateString('en-US', opts)
    const sunStr = sun.toLocaleDateString('en-US', { ...opts, year: 'numeric' })
    return `${monStr} – ${sunStr}`
  }

  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={onPrev}
        className="neu-btn p-2"
        aria-label="Previous week"
        style={{ padding: '0.5rem' }}
      >
        <ChevronLeft size={18} />
      </button>
      <span className="font-semibold text-base" style={{ color: 'var(--neu-text)', minWidth: '200px', textAlign: 'center' }}>
        {formatRange(monday, sunday)}
      </span>
      <button
        onClick={onNext}
        className="neu-btn p-2"
        aria-label="Next week"
        style={{ padding: '0.5rem' }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
