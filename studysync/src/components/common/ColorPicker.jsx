import React from 'react'
import { SUBJECT_COLORS } from '../../constants/colors.js'

export default function ColorPicker({ value, onChange, error }) {
  return (
    <div>
      <div className="flex flex-wrap gap-3 mt-1">
        {SUBJECT_COLORS.map(color => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            aria-label={color.label}
            aria-pressed={value === color.value}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: color.value,
              border: 'none',
              cursor: 'pointer',
              outline: value === color.value
                ? `3px solid var(--neu-text)`
                : '3px solid transparent',
              outlineOffset: '2px',
              transition: 'outline 0.15s ease',
              boxShadow: 'var(--shadow-raised-sm)',
            }}
          />
        ))}
      </div>
      {error && (
        <span
          className="text-sm mt-1 block"
          style={{ color: 'var(--neu-danger)' }}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  )
}
