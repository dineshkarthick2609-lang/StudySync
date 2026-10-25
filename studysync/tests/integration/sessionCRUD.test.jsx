import React from 'react'
import { describe, it, expect, beforeEach, afterEach, act } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { AppProvider, useAppContext } from '../../src/context/AppContext.jsx'
import { writeStore } from '../../src/utils/storage.js'
import { SUBJECT_COLOR_VALUES } from '../../src/constants/colors.js'
import { sessionsOverlap } from '../../src/utils/dateUtils.js'
import { calcTotalStudyMinutes } from '../../src/utils/progressUtils.js'

function setupSession() {
  writeStore('studysync_session', {
    username: 'testuser',
    name: 'Test User',
    loggedInAt: new Date().toISOString(),
  })
}

function TestHarness({ onRender }) {
  const ctx = useAppContext()
  onRender(ctx)
  return null
}

describe('Session CRUD Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    setupSession()
  })
  afterEach(() => localStorage.clear())

  async function setupCtxWithSubject() {
    let ctx
    render(
      <AppProvider>
        <TestHarness onRender={c => { ctx = c }} />
      </AppProvider>
    )
    await waitFor(() => expect(ctx).toBeDefined())
    act(() => {
      ctx.addSubject({ name: 'Math', color: SUBJECT_COLOR_VALUES[0], description: '' })
    })
    let subId
    await waitFor(() => { subId = ctx.subjects[0]?.id })
    return { ctx, subId }
  }

  it('adds a session and it appears in state', async () => {
    const { ctx, subId } = await setupCtxWithSubject()

    act(() => {
      ctx.addSession({
        subjectId: subId,
        date: '2026-10-15',
        startTime: '09:00',
        endTime: '10:00',
        notes: '',
      })
    })

    await waitFor(() => {
      expect(ctx.sessions).toHaveLength(1)
      expect(ctx.sessions[0].date).toBe('2026-10-15')
    })
  })

  it('overlap detected when sessions conflict', () => {
    const a = { date: '2026-10-15', startTime: '09:00', endTime: '10:30' }
    const b = { date: '2026-10-15', startTime: '10:00', endTime: '11:00' }
    expect(sessionsOverlap(a, b)).toBe(true)
  })

  it('adjacent sessions do not overlap', () => {
    const a = { date: '2026-10-15', startTime: '09:00', endTime: '10:00' }
    const b = { date: '2026-10-15', startTime: '10:00', endTime: '11:00' }
    expect(sessionsOverlap(a, b)).toBe(false)
  })

  it('deletes a session and it is removed from state', async () => {
    const { ctx, subId } = await setupCtxWithSubject()

    act(() => {
      ctx.addSession({
        subjectId: subId,
        date: '2026-10-15',
        startTime: '09:00',
        endTime: '10:00',
        notes: '',
      })
    })

    let sessionId
    await waitFor(() => { sessionId = ctx.sessions[0]?.id })

    act(() => {
      ctx.deleteSession(sessionId)
    })

    await waitFor(() => {
      expect(ctx.sessions).toHaveLength(0)
    })
  })

  it('progress totals decrease after session deletion', async () => {
    const { ctx, subId } = await setupCtxWithSubject()

    act(() => {
      ctx.addSession({ subjectId: subId, date: '2026-10-15', startTime: '09:00', endTime: '10:30', notes: '' })
      ctx.addSession({ subjectId: subId, date: '2026-10-15', startTime: '11:00', endTime: '12:00', notes: '' })
    })

    let sessionId
    await waitFor(() => {
      expect(ctx.sessions).toHaveLength(2)
      sessionId = ctx.sessions[0].id
    })

    const before = calcTotalStudyMinutes(ctx.sessions)
    expect(before).toBe(150)

    act(() => {
      ctx.deleteSession(sessionId)
    })

    await waitFor(() => {
      const after = calcTotalStudyMinutes(ctx.sessions)
      expect(after).toBeLessThan(before)
    })
  })
})
