import React from 'react'

export default function ProgressBar({ value = 0, color }) {
  const clamped = Math.min(100, Math.max(0, value))
  const barColor = color || 'var(--neu-accent)'

  return (
    <div
      className="neu-input w-full overflow-hidden"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ padding: 0, height: '12px', borderRadius: '6px' }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: '100%',
          backgroundColor: barColor,
          borderRadius: '6px',
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  )
}
