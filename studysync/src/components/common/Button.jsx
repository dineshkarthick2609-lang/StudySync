import React from 'react'

const variantClasses = {
  primary: 'neu-btn-accent',
  secondary: 'neu-btn',
  danger: 'neu-btn-danger',
}

export default function Button({
  variant = 'secondary',
  size,
  onClick,
  disabled = false,
  children,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
}) {
  const cls = variantClasses[variant] || 'neu-btn'
  return (
    <button
      type={type}
      className={`${cls} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
