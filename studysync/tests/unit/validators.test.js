import { describe, it, expect } from 'vitest'
import { validateSubject, validateAssignment, validateSession } from '../../src/utils/validators.js'
import { SUBJECT_COLOR_VALUES } from '../../src/constants/colors.js'

const validColor = SUBJECT_COLOR_VALUES[0]

describe('validateSubject', () => {
  it('returns valid for correct input', () => {
    const result = validateSubject({ name: 'Math', color: validColor }, [])
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('invalid when name is too short (< 2 chars)', () => {
    const result = validateSubject({ name: 'A', color: validColor }, [])
    expect(result.valid).toBe(false)
    expect(result.errors.name).toBeTruthy()
  })

  it('invalid when name is empty', () => {
    const result = validateSubject({ name: '', color: validColor }, [])
    expect(result.valid).toBe(false)
    expect(result.errors.name).toBeTruthy()
  })

  it('invalid when name is too long (> 50 chars)', () => {
    const name = 'A'.repeat(51)
    const result = validateSubject({ name, color: validColor }, [])
    expect(result.valid).toBe(false)
    expect(result.errors.name).toBeTruthy()
  })

  it('invalid with non-palette color', () => {
    const result = validateSubject({ name: 'Math', color: '#000000' }, [])
    expect(result.valid).toBe(false)
    expect(result.errors.color).toBeTruthy()
  })

  it('invalid when color is missing', () => {
    const result = validateSubject({ name: 'Math', color: '' }, [])
    expect(result.valid).toBe(false)
    expect(result.errors.color).toBeTruthy()
  })

  it('invalid when name is duplicate (case-insensitive)', () => {
    const existing = [{ id: '1', name: 'Math', color: validColor }]
    const result = validateSubject({ name: 'math', color: validColor }, existing)
    expect(result.valid).toBe(false)
    expect(result.errors.name).toBeTruthy()
  })

  it('valid when editing own name (editingId matches)', () => {
    const existing = [{ id: '1', name: 'Math', color: validColor }]
    const result = validateSubject({ name: 'Math', color: validColor }, existing, '1')
    expect(result.valid).toBe(true)
  })
})

describe('validateAssignment', () => {
  const valid = {
    title: 'Homework 1',
    subjectId: 'abc-123',
    dueDate: '2026-12-01',
    priority: 'medium',
    status: 'todo',
    notes: '',
  }

  it('returns valid for correct input', () => {
    expect(validateAssignment(valid).valid).toBe(true)
  })

  it('invalid when title is missing', () => {
    const r = validateAssignment({ ...valid, title: '' })
    expect(r.valid).toBe(false)
    expect(r.errors.title).toBeTruthy()
  })

  it('invalid when title is too short', () => {
    const r = validateAssignment({ ...valid, title: 'A' })
    expect(r.valid).toBe(false)
    expect(r.errors.title).toBeTruthy()
  })

  it('invalid when subjectId is missing', () => {
    const r = validateAssignment({ ...valid, subjectId: '' })
    expect(r.valid).toBe(false)
    expect(r.errors.subjectId).toBeTruthy()
  })

  it('invalid when priority is wrong value', () => {
    const r = validateAssignment({ ...valid, priority: 'urgent' })
    expect(r.valid).toBe(false)
    expect(r.errors.priority).toBeTruthy()
  })

  it('invalid when dueDate is missing', () => {
    const r = validateAssignment({ ...valid, dueDate: '' })
    expect(r.valid).toBe(false)
    expect(r.errors.dueDate).toBeTruthy()
  })
})

describe('validateSession', () => {
  const valid = {
    subjectId: 'abc-123',
    date: '2026-10-15',
    startTime: '09:00',
    endTime: '10:30',
    notes: '',
  }

  it('returns valid for correct times', () => {
    const r = validateSession(valid, [])
    expect(r.valid).toBe(true)
  })

  it('invalid when end <= start', () => {
    const r = validateSession({ ...valid, endTime: '09:00' }, [])
    expect(r.valid).toBe(false)
    expect(r.errors.endTime).toBeTruthy()
  })

  it('invalid when end < start', () => {
    const r = validateSession({ ...valid, endTime: '08:00' }, [])
    expect(r.valid).toBe(false)
    expect(r.errors.endTime).toBeTruthy()
  })

  it('invalid when date is missing', () => {
    const r = validateSession({ ...valid, date: '' }, [])
    expect(r.valid).toBe(false)
    expect(r.errors.date).toBeTruthy()
  })

  it('invalid when subjectId is missing', () => {
    const r = validateSession({ ...valid, subjectId: '' }, [])
    expect(r.valid).toBe(false)
    expect(r.errors.subjectId).toBeTruthy()
  })
})
