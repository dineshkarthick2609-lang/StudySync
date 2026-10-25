import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { calcProgress, calcTotalStudyMinutes } from '../../src/utils/progressUtils.js'

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
  notes: fc.string({ maxLength: 50 }),
}).filter(s => s.startTime < s.endTime)

describe('PBT – Progress Calculations', () => {
  // PBT-PRG-01: calcProgress always in [0, 100]
  it('calcProgress always returns value in [0, 100]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000 }).chain(total =>
          fc.integer({ min: 0, max: total }).map(completed => ({ completed, total }))
        ),
        ({ completed, total }) => {
          const p = calcProgress(completed, total)
          return p >= 0 && p <= 100
        }
      )
    )
  })

  // PBT-PRG-02: calcProgress(n, n) === 100 for n > 0
  it('calcProgress(n, n) === 100 for any n > 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }),
        (n) => calcProgress(n, n) === 100
      )
    )
  })

  // PBT-PRG-03: calcProgress(0, n) === 0 for any n >= 0
  it('calcProgress(0, n) === 0 for any n >= 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000 }),
        (n) => calcProgress(0, n) === 0
      )
    )
  })

  // PBT-PRG-04: calcTotalStudyMinutes >= 0 for any sessions list
  it('calcTotalStudyMinutes is always >= 0', () => {
    fc.assert(
      fc.property(
        fc.array(validSessionArb, { maxLength: 20 }),
        (sessions) => calcTotalStudyMinutes(sessions) >= 0
      )
    )
  })

  // PBT-PRG-05: calcTotalStudyMinutes equals manual sum
  it('calcTotalStudyMinutes equals manual sum', () => {
    fc.assert(
      fc.property(
        fc.array(validSessionArb, { maxLength: 20 }),
        (sessions) => {
          const expected = sessions.reduce((sum, s) => {
            const [sh, sm] = s.startTime.split(':').map(Number)
            const [eh, em] = s.endTime.split(':').map(Number)
            return sum + (eh * 60 + em) - (sh * 60 + sm)
          }, 0)
          return calcTotalStudyMinutes(sessions) === expected
        }
      )
    )
  })
})
