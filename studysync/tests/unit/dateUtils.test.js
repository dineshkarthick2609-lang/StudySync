import { describe, it, expect } from 'vitest'
import {
  getWeekBounds,
  isOverdue,
  sessionsOverlap,
  formatDuration,
} from '../../src/utils/dateUtils.js'

describe('getWeekBounds', () => {
  it('returns Monday for a Wednesday input', () => {
    // 2026-10-14 is a Wednesday
    const { monday } = getWeekBounds(new Date('2026-10-14'))
    expect(monday.getDay()).toBe(1)
    expect(monday.toISOString().slice(0, 10)).toBe('2026-10-12')
  })

  it('returns Monday for a Sunday input', () => {
    // 2026-10-18 is a Sunday
    const { monday } = getWeekBounds(new Date('2026-10-18'))
    expect(monday.getDay()).toBe(1)
    expect(monday.toISOString().slice(0, 10)).toBe('2026-10-12')
  })

  it('returns Monday for a Monday input', () => {
    // 2026-10-12 is a Monday
    const { monday } = getWeekBounds(new Date('2026-10-12'))
    expect(monday.getDay()).toBe(1)
    expect(monday.toISOString().slice(0, 10)).toBe('2026-10-12')
  })

  it('sunday is 6 days after monday', () => {
    const { monday, sunday } = getWeekBounds(new Date('2026-10-14'))
    expect(sunday.getDay()).toBe(0)
    const diff = (sunday.getTime() - monday.getTime()) / (1000 * 60 * 60 * 24)
    expect(Math.round(diff)).toBe(6)
  })

  it('input date falls within [monday, sunday]', () => {
    const date = new Date('2026-10-14')
    const { monday, sunday } = getWeekBounds(date)
    expect(date >= monday).toBe(true)
    expect(date <= sunday).toBe(true)
  })
})

describe('isOverdue', () => {
  it('past due and todo → true', () => {
    const a = { dueDate: '2020-01-01', status: 'todo' }
    expect(isOverdue(a)).toBe(true)
  })

  it('future due and todo → false', () => {
    const a = { dueDate: '2099-12-31', status: 'todo' }
    expect(isOverdue(a)).toBe(false)
  })

  it('past due but done → false', () => {
    const a = { dueDate: '2020-01-01', status: 'done' }
    expect(isOverdue(a)).toBe(false)
  })

  it('null assignment → false', () => {
    expect(isOverdue(null)).toBe(false)
  })
})

describe('sessionsOverlap', () => {
  const date = '2026-10-14'

  it('overlapping ranges → true', () => {
    const a = { date, startTime: '09:00', endTime: '10:00' }
    const b = { date, startTime: '09:30', endTime: '11:00' }
    expect(sessionsOverlap(a, b)).toBe(true)
    expect(sessionsOverlap(b, a)).toBe(true)
  })

  it('adjacent ranges → false (end == start)', () => {
    const a = { date, startTime: '09:00', endTime: '10:00' }
    const b = { date, startTime: '10:00', endTime: '11:00' }
    expect(sessionsOverlap(a, b)).toBe(false)
    expect(sessionsOverlap(b, a)).toBe(false)
  })

  it('non-overlapping ranges → false', () => {
    const a = { date, startTime: '09:00', endTime: '10:00' }
    const b = { date, startTime: '11:00', endTime: '12:00' }
    expect(sessionsOverlap(a, b)).toBe(false)
  })

  it('different dates → false', () => {
    const a = { date: '2026-10-14', startTime: '09:00', endTime: '11:00' }
    const b = { date: '2026-10-15', startTime: '09:00', endTime: '11:00' }
    expect(sessionsOverlap(a, b)).toBe(false)
  })

  it('one fully contained in another → true', () => {
    const a = { date, startTime: '08:00', endTime: '12:00' }
    const b = { date, startTime: '09:00', endTime: '10:00' }
    expect(sessionsOverlap(a, b)).toBe(true)
  })
})

describe('formatDuration', () => {
  it('90 minutes → "1h 30m"', () => {
    expect(formatDuration(90)).toBe('1h 30m')
  })

  it('60 minutes → "1h 0m"', () => {
    expect(formatDuration(60)).toBe('1h 0m')
  })

  it('30 minutes → "30m"', () => {
    expect(formatDuration(30)).toBe('30m')
  })

  it('0 minutes → "0m"', () => {
    expect(formatDuration(0)).toBe('0m')
  })

  it('negative input → "0m"', () => {
    expect(formatDuration(-10)).toBe('0m')
  })
})
