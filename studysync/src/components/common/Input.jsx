import React from 'react'

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  id,
  name,
  min,
  max,
  required,
  disabled,
  className = '',
}) {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium"
          style={{ color: 'var(--neu-text)' }}
        >
          {label}
          {required && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name || inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        className="neu-input"
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={!!error}
      />
      {error && (
        <span
          id={`${inputId}-error`}
          className="text-sm"
          style={{ color: 'var(--neu-danger)' }}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  )
}
