import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { validateSession } from '../../src/utils/validators.js'
import { sessionsOverlap } from '../../src/utils/dateUtils.js'

const timeArb = fc.tuple(
  fc.integer({ min: 0, max: 23 }),
  fc.integer({ min: 0, max: 59 })
).map(([h, m]) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)

const validISODate = fc.date({
  min: new Date('2020-01-01'),
  max: new Date('2030-12-31'),
}).map(d => d.toISOString().slice(0, 10))

const validSessionArb = fc.record({
  subjectId: fc.uuid(),
  date: validISODate,
  startTime: timeArb,
  endTime: timeArb,
  notes: fc.string({ maxLength: 100 }),
}).filter(s => s.startTime < s.endTime)

const invalidSessionTimeArb = fc.record({
  subjectId: fc.uuid(),
  date: validISODate,
  startTime: timeArb,
  endTime: timeArb,
  notes: fc.string({ maxLength: 50 }),
}).filter(s => s.endTime <= s.startTime)

describe('PBT – Session Time Validation & Overlap', () => {
  // PBT-STU-01: end > start → valid
  it('end > start → session always valid', () => {
    fc.assert(
      fc.property(validSessionArb, (session) => {
        const result = validateSession(session, [])
        return result.valid === true
      })
    )
  })

  // PBT-STU-02: end ≤ start → invalid
  it('end ≤ start → session always invalid', () => {
    fc.assert(
      fc.property(invalidSessionTimeArb, (session) => {
        const result = validateSession(session, [])
        return result.valid === false
      })
    )
  })

  // PBT-STU-03: overlap is commutative
  it('overlap is commutative: A overlaps B ↔ B overlaps A', () => {
    fc.assert(
      fc.property(validSessionArb, validSessionArb, (a, b) => {
        return sessionsOverlap(a, b) === sessionsOverlap(b, a)
      })
    )
  })

  // PBT-STU-04: adjacent sessions (a.endTime === b.startTime) do NOT overlap
  it('adjacent sessions do not overlap', () => {
    fc.assert(
      fc.property(
        validISODate,
        timeArb,
        timeArb,
        (date, t1, t2) => {
          // Build t1 < t2 for start/pivot, t2 is the meeting point
          const [lo, hi] = t1 < t2 ? [t1, t2] : [t2, t1]
          if (lo === hi) return true // skip equal times
          const a = { date, startTime: lo, endTime: hi, subjectId: 'x' }
          const b = { date, startTime: hi, endTime: '23:59', subjectId: 'y' }
          if (b.startTime >= b.endTime) return true // skip invalid b
          return sessionsOverlap(a, b) === false
        }
      )
    )
  })

  // PBT-STU-05: session that fits in a gap does not trigger overlap
  it('session fitting in a gap does not trigger overlap with surrounding sessions', () => {
    fc.assert(
      fc.property(
        validISODate,
        (date) => {
          // Three non-overlapping sessions: [08-09], gap, [11-12]
          const before = { date, startTime: '08:00', endTime: '09:00', subjectId: 'a' }
          const after = { date, startTime: '11:00', endTime: '12:00', subjectId: 'b' }
          const inGap = { date, startTime: '09:30', endTime: '10:30', subjectId: 'c' }
          return (
            !sessionsOverlap(inGap, before) &&
            !sessionsOverlap(inGap, after)
          )
        }
      )
    )
  })
})
