import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { filterAssignments, satisfiesAllFilters } from '../../src/utils/assignmentUtils.js'

const statusArb = fc.constantFrom('todo', 'in-progress', 'done')
const priorityArb = fc.constantFrom('low', 'medium', 'high')

const assignmentArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 2, maxLength: 50 }),
  subjectId: fc.uuid(),
  dueDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
    .map(d => d.toISOString().slice(0, 10)),
  priority: priorityArb,
  status: statusArb,
  notes: fc.string({ maxLength: 100 }),
})

const filtersArb = fc.record({
  subjectId: fc.option(fc.uuid(), { nil: '' }).map(v => v || ''),
  statuses: fc.array(statusArb, { maxLength: 3 }).map(arr => [...new Set(arr)]),
  priorities: fc.array(priorityArb, { maxLength: 3 }).map(arr => [...new Set(arr)]),
})

describe('PBT – Assignment Filters', () => {
  // PBT-ASN-01: result is always a subset of input
  it('filter result is always a subset of input', () => {
    fc.assert(
      fc.property(
        fc.array(assignmentArb),
        filtersArb,
        (assignments, filters) => {
          const result = filterAssignments(assignments, filters)
          return result.every(a => assignments.some(orig => orig.id === a.id))
        }
      )
    )
  })

  // PBT-ASN-02: idempotent — applying same filters twice = once
  it('filterAssignments is idempotent', () => {
    fc.assert(
      fc.property(
        fc.array(assignmentArb),
        filtersArb,
        (assignments, filters) => {
          const r1 = filterAssignments(assignments, filters)
          const r2 = filterAssignments(r1, filters)
          return JSON.stringify(r1) === JSON.stringify(r2)
        }
      )
    )
  })

  // PBT-ASN-03: no filters → full list (same length)
  it('no active filters → returns all assignments (sorted)', () => {
    fc.assert(
      fc.property(
        fc.array(assignmentArb),
        (assignments) => {
          const result = filterAssignments(assignments, {})
          return result.length === assignments.length
        }
      )
    )
  })

  // PBT-ASN-04: every result item satisfies all active filters (AND semantics)
  it('every item in filtered result satisfies all active filters', () => {
    fc.assert(
      fc.property(
        fc.array(assignmentArb),
        filtersArb,
        (assignments, filters) => {
          const result = filterAssignments(assignments, filters)
          return result.every(a => satisfiesAllFilters(a, filters))
        }
      )
    )
  })
})
