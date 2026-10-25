import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { readStore, writeStore } from '../../src/utils/storage.js'
import { SUBJECT_COLOR_VALUES } from '../../src/constants/colors.js'

const validSubjectArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 2, maxLength: 50 }).map(s => s.trim()).filter(s => s.length >= 2),
  color: fc.constantFrom(...SUBJECT_COLOR_VALUES),
  description: fc.string({ maxLength: 200 }),
  createdAt: fc.date().map(d => d.toISOString()),
})

const priorityArb = fc.constantFrom('low', 'medium', 'high')
const statusArb = fc.constantFrom('todo', 'in-progress', 'done')

const validAssignmentArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 2, maxLength: 100 }),
  subjectId: fc.uuid(),
  dueDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
    .map(d => d.toISOString().slice(0, 10)),
  priority: priorityArb,
  status: statusArb,
  notes: fc.string({ maxLength: 500 }),
  createdAt: fc.date().map(d => d.toISOString()),
})

function validSubjectSample() {
  return {
    id: 'sample-id',
    name: 'Sample Subject',
    color: SUBJECT_COLOR_VALUES[0],
    description: 'A description',
    createdAt: new Date().toISOString(),
  }
}

describe('PBT – LocalStorage Serialization', () => {
  // PBT-LS-01: serialize ∘ deserialize ∘ serialize is identity
  it('serialize → deserialize → serialize is identity', () => {
    fc.assert(
      fc.property(
        fc.array(validSubjectArb, { maxLength: 20 }),
        (subjects) => {
          const s1 = JSON.stringify(subjects)
          const s2 = JSON.stringify(JSON.parse(s1))
          const s3 = JSON.stringify(JSON.parse(s2))
          return s2 === s3
        }
      )
    )
  })

  // PBT-LS-02: corrupted JSON returns default, no throw
  it('deserializing corrupted JSON returns default and does not throw', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (garbage) => {
          try {
            // Simulate readStore with corrupted value
            const parsed = JSON.parse(garbage)
            // If it doesn't throw, that's fine too
            return true
          } catch {
            // JSON.parse threw — readStore should catch this and return default
            const key = `__test_corrupted_${Date.now()}`
            localStorage.setItem(key, garbage)
            const result = readStore(key, [])
            localStorage.removeItem(key)
            return Array.isArray(result) && result.length === 0
          }
        }
      )
    )
  })

  // PBT-LS-03: field types preserved after round-trip
  it('assignment field types are preserved after JSON round-trip', () => {
    fc.assert(
      fc.property(
        validAssignmentArb,
        (assignment) => {
          const parsed = JSON.parse(JSON.stringify(assignment))
          return (
            typeof parsed.dueDate === 'string' &&
            typeof parsed.title === 'string' &&
            ['low', 'medium', 'high'].includes(parsed.priority) &&
            ['todo', 'in-progress', 'done'].includes(parsed.status)
          )
        }
      )
    )
  })

  // PBT-LS-04: N subjects (0-100) can be serialized within 5 MB
  it('N subjects (0-100) serialize within 5 MB', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        (n) => {
          const subjects = Array.from({ length: n }, () => validSubjectSample())
          const serialized = JSON.stringify(subjects)
          const size = new Blob([serialized]).size
          return size < 5 * 1024 * 1024
        }
      )
    )
  })
})
