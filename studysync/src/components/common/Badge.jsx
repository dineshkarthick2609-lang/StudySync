import React from 'react'

export default function Badge({ label, color, textColor = '#fff', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{ backgroundColor: color, color: textColor }}
    >
      {label}
    </span>
  )
}
