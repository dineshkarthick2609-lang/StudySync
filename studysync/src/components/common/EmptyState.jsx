import React from 'react'

export default function EmptyState({ icon: Icon, heading, subtext, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div
          className="neu-card-sm mb-4 inline-flex"
          style={{ color: 'var(--neu-text-light)' }}
        >
          <Icon size={32} />
        </div>
      )}
      <h3
        className="text-lg font-semibold mb-1"
        style={{ color: 'var(--neu-text)' }}
      >
        {heading}
      </h3>
      {subtext && (
        <p
          className="text-sm mb-4"
          style={{ color: 'var(--neu-text-light)' }}
        >
          {subtext}
        </p>
      )}
      {action}
    </div>
  )
}
