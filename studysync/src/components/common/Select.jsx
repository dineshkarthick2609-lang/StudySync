import React from 'react'

export default function Select({
  label,
  options = [],
  value,
  onChange,
  error,
  id,
  name,
  required,
  disabled,
  placeholder,
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
      <select
        id={inputId}
        name={name || inputId}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="neu-input cursor-pointer"
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={!!error}
        style={{ appearance: 'auto' }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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
