import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { getWeekBounds, filterSessionsByWeek } from '../../src/utils/dateUtils.js'

const dateArb = fc.date({
  min: new Date('2020-01-01'),
  max: new Date('2030-12-31'),
})

const validISODate = dateArb.map(d => d.toISOString().slice(0, 10))

const timeArb = fc.tuple(
  fc.integer({ min: 0, max: 23 }),
  fc.integer({ min: 0, max: 59 })
).map(([h, m]) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)

const validSessionArb = fc.record({
  id: fc.uuid(),
  subjectId: fc.uuid(),
  date: validISODate,
  startTime: timeArb,
  endTime: timeArb,
  notes: fc.string({ maxLength: 50 }),
}).filter(s => s.startTime < s.endTime)

describe('PBT – Weekly Calculations', () => {
  // PBT-WK-01: monday.getDay() === 1
  it('getWeekBounds(d).monday.getDay() === 1 for any date', () => {
    fc.assert(
      fc.property(dateArb, (date) => {
        return getWeekBounds(date).monday.getDay() === 1
      })
    )
  })

  // PBT-WK-02: sunday.getDay() === 0
  it('getWeekBounds(d).sunday.getDay() === 0 for any date', () => {
    fc.assert(
      fc.property(dateArb, (date) => {
        return getWeekBounds(date).sunday.getDay() === 0
      })
    )
  })

  // PBT-WK-03: date is within [monday, sunday]
  it('input date always falls within returned [monday, sunday]', () => {
    fc.assert(
      fc.property(dateArb, (date) => {
        const { monday, sunday } = getWeekBounds(date)
        return date >= monday && date <= sunday
      })
    )
  })

  // PBT-WK-04: filterSessionsByWeek returns only in-range sessions
  it('filterSessionsByWeek returns only sessions within the week range', () => {
    fc.assert(
      fc.property(
        dateArb,
        fc.array(validSessionArb, { maxLength: 20 }),
        (date, sessions) => {
          const { monday, sunday } = getWeekBounds(date)
          const monStr = monday.toISOString().slice(0, 10)
          const sunStr = sunday.toISOString().slice(0, 10)
          const result = filterSessionsByWeek(sessions, monday, sunday)
          return result.every(s => s.date >= monStr && s.date <= sunStr)
        }
      )
    )
  })

  // PBT-WK-05: partitioning by week — each session in exactly one bucket
  it('each session appears in exactly one weekly bucket across a 4-week range', () => {
    fc.assert(
      fc.property(
        fc.array(validSessionArb, { minLength: 0, maxLength: 20 }),
        (sessions) => {
          // Generate 4 consecutive week ranges
          const baseDate = new Date('2026-01-05') // a Monday
          const weeks = Array.from({ length: 4 }, (_, i) => {
            const d = new Date(baseDate)
            d.setDate(baseDate.getDate() + i * 7)
            return getWeekBounds(d)
          })

          const allBuckets = weeks.map(({ monday, sunday }) =>
            filterSessionsByWeek(sessions, monday, sunday)
          )

          // Each session in the 4-week range should appear in exactly one bucket
          const filteredSessions = sessions.filter(s => {
            const firstMon = weeks[0].monday.toISOString().slice(0, 10)
            const lastSun = weeks[weeks.length - 1].sunday.toISOString().slice(0, 10)
            return s.date >= firstMon && s.date <= lastSun
          })

          return filteredSessions.every(s => {
            const count = allBuckets.filter(bucket =>
              bucket.some(b => b.id === s.id)
            ).length
            return count === 1
          })
        }
      )
    )
  })
})
