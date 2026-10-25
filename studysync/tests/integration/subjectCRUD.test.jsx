import React from 'react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProvider, useAppContext } from '../../src/context/AppContext.jsx'
import { readStore, writeStore, clearStore } from '../../src/utils/storage.js'
import { SUBJECT_COLOR_VALUES } from '../../src/constants/colors.js'

// Setup a session so AppContext loads data
function setupSession() {
  writeStore('studysync_session', {
    username: 'testuser',
    name: 'Test User',
    loggedInAt: new Date().toISOString(),
  })
}

// Test component that exercises the context
function SubjectTestHarness({ onRender }) {
  const ctx = useAppContext()
  onRender(ctx)
  return null
}

describe('Subject CRUD Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    setupSession()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('adds a subject and it appears in state', async () => {
    let ctx
    render(
      <AppProvider>
        <SubjectTestHarness onRender={c => { ctx = c }} />
      </AppProvider>
    )

    await waitFor(() => expect(ctx).toBeDefined())

    act(() => {
      ctx.addSubject({ name: 'Math', color: SUBJECT_COLOR_VALUES[0], description: '' })
    })

    await waitFor(() => {
      expect(ctx.subjects).toHaveLength(1)
      expect(ctx.subjects[0].name).toBe('Math')
    })
  })

  it('persists subjects to localStorage', async () => {
    let ctx
    render(
      <AppProvider>
        <SubjectTestHarness onRender={c => { ctx = c }} />
      </AppProvider>
    )

    await waitFor(() => expect(ctx).toBeDefined())

    act(() => {
      ctx.addSubject({ name: 'Physics', color: SUBJECT_COLOR_VALUES[1], description: '' })
    })

    await waitFor(() => {
      const stored = readStore('studysync_testuser_subjects', [])
      expect(stored).toHaveLength(1)
      expect(stored[0].name).toBe('Physics')
    })
  })

  it('edits a subject', async () => {
    let ctx
    render(
      <AppProvider>
        <SubjectTestHarness onRender={c => { ctx = c }} />
      </AppProvider>
    )

    await waitFor(() => expect(ctx).toBeDefined())
    act(() => {
      ctx.addSubject({ name: 'Biology', color: SUBJECT_COLOR_VALUES[2], description: '' })
    })

    let subjectId
    await waitFor(() => {
      expect(ctx.subjects).toHaveLength(1)
      subjectId = ctx.subjects[0].id
    })

    act(() => {
      ctx.updateSubject(subjectId, { name: 'Advanced Biology' })
    })

    await waitFor(() => {
      expect(ctx.subjects[0].name).toBe('Advanced Biology')
    })
  })

  it('deletes a subject and cascades to assignments and sessions', async () => {
    let ctx
    render(
      <AppProvider>
        <SubjectTestHarness onRender={c => { ctx = c }} />
      </AppProvider>
    )

    await waitFor(() => expect(ctx).toBeDefined())

    act(() => {
      ctx.addSubject({ name: 'Chemistry', color: SUBJECT_COLOR_VALUES[3], description: '' })
    })

    let subjectId
    await waitFor(() => {
      expect(ctx.subjects).toHaveLength(1)
      subjectId = ctx.subjects[0].id
    })

    act(() => {
      ctx.addAssignment({
        title: 'Lab Report',
        subjectId,
        dueDate: '2026-12-01',
        priority: 'medium',
        status: 'todo',
        notes: '',
      })
      ctx.addSession({
        subjectId,
        date: '2026-10-15',
        startTime: '09:00',
        endTime: '10:00',
        notes: '',
      })
    })

    await waitFor(() => {
      expect(ctx.assignments).toHaveLength(1)
      expect(ctx.sessions).toHaveLength(1)
    })

    act(() => {
      ctx.deleteSubject(subjectId)
    })

    await waitFor(() => {
      expect(ctx.subjects).toHaveLength(0)
      expect(ctx.assignments).toHaveLength(0)
      expect(ctx.sessions).toHaveLength(0)
    })
  })
})
