import React from 'react'

export default function Card({ children, className = '', onClick }) {
  return (
    <div
      className={`neu-card ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}
