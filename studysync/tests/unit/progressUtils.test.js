import { describe, it, expect } from 'vitest'
import { calcProgress, calcTotalStudyMinutes } from '../../src/utils/progressUtils.js'

describe('calcProgress', () => {
  it('calcProgress(0, 0) returns 0', () => {
    expect(calcProgress(0, 0)).toBe(0)
  })

  it('calcProgress(0, 5) returns 0', () => {
    expect(calcProgress(0, 5)).toBe(0)
  })

  it('calcProgress(5, 5) returns 100', () => {
    expect(calcProgress(5, 5)).toBe(100)
  })

  it('calcProgress(3, 10) returns 30', () => {
    expect(calcProgress(3, 10)).toBe(30)
  })

  it('floors fractional result', () => {
    expect(calcProgress(1, 3)).toBe(33)  // floor(33.33)
  })

  it('calcProgress(1, 1) returns 100', () => {
    expect(calcProgress(1, 1)).toBe(100)
  })
})

describe('calcTotalStudyMinutes', () => {
  it('empty list returns 0', () => {
    expect(calcTotalStudyMinutes([])).toBe(0)
  })

  it('single session returns correct minutes', () => {
    const sessions = [{ startTime: '09:00', endTime: '10:30' }]
    expect(calcTotalStudyMinutes(sessions)).toBe(90)
  })

  it('multiple sessions sums correctly', () => {
    const sessions = [
      { startTime: '09:00', endTime: '10:00' },  // 60
      { startTime: '14:00', endTime: '15:30' },  // 90
    ]
    expect(calcTotalStudyMinutes(sessions)).toBe(150)
  })

  it('ignores sessions with end <= start', () => {
    const sessions = [
      { startTime: '10:00', endTime: '09:00' },  // invalid, should not add negative
    ]
    expect(calcTotalStudyMinutes(sessions)).toBe(0)
  })
})
