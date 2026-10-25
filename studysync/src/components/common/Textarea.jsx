import React from 'react'

export default function Textarea({
  label,
  value,
  onChange,
  error,
  maxLength,
  placeholder,
  id,
  rows = 3,
  className = '',
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium"
          style={{ color: 'var(--neu-text)' }}
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={rows}
        className="neu-input resize-none"
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={!!error}
      />
      <div className="flex justify-between items-center">
        {error ? (
          <span
            id={`${inputId}-error`}
            className="text-sm"
            style={{ color: 'var(--neu-danger)' }}
            role="alert"
          >
            {error}
          </span>
        ) : (
          <span />
        )}
        {maxLength != null && (
          <span
            className="text-xs"
            style={{ color: 'var(--neu-text-light)' }}
          >
            {(value || '').length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  )
}
