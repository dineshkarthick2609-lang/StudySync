import React from 'react'
import { describe, it, expect, beforeEach, afterEach, act } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { AppProvider, useAppContext } from '../../src/context/AppContext.jsx'
import { writeStore } from '../../src/utils/storage.js'
import { SUBJECT_COLOR_VALUES } from '../../src/constants/colors.js'
import { filterAssignments } from '../../src/utils/assignmentUtils.js'

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

describe('Assignment CRUD Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    setupSession()
  })
  afterEach(() => localStorage.clear())

  async function setupCtx() {
    let ctx
    render(
      <AppProvider>
        <TestHarness onRender={c => { ctx = c }} />
      </AppProvider>
    )
    await waitFor(() => expect(ctx).toBeDefined())
    return ctx
  }

  it('adds an assignment and it appears in state', async () => {
    const ctx = await setupCtx()
    act(() => {
      ctx.addSubject({ name: 'Math', color: SUBJECT_COLOR_VALUES[0], description: '' })
    })
    let subId
    await waitFor(() => { subId = ctx.subjects[0]?.id })

    act(() => {
      ctx.addAssignment({
        title: 'HW1',
        subjectId: subId,
        dueDate: '2026-12-01',
        priority: 'medium',
        status: 'todo',
        notes: '',
      })
    })

    await waitFor(() => {
      expect(ctx.assignments).toHaveLength(1)
      expect(ctx.assignments[0].title).toBe('HW1')
    })
  })

  it('filter by subject returns correct results', () => {
    const assignments = [
      { id: '1', subjectId: 'A', status: 'todo', priority: 'low', dueDate: '2026-10-10' },
      { id: '2', subjectId: 'B', status: 'todo', priority: 'high', dueDate: '2026-10-11' },
    ]
    const result = filterAssignments(assignments, { subjectId: 'A' })
    expect(result).toHaveLength(1)
    expect(result[0].subjectId).toBe('A')
  })

  it('combined filter (subject + status) uses AND logic', () => {
    const assignments = [
      { id: '1', subjectId: 'A', status: 'todo', priority: 'low', dueDate: '2026-10-10' },
      { id: '2', subjectId: 'A', status: 'done', priority: 'high', dueDate: '2026-10-11' },
      { id: '3', subjectId: 'B', status: 'todo', priority: 'medium', dueDate: '2026-10-12' },
    ]
    const result = filterAssignments(assignments, { subjectId: 'A', statuses: ['todo'] })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })

  it('marking assignment as done removes it from overdue list', async () => {
    const ctx = await setupCtx()
    act(() => {
      ctx.addSubject({ name: 'Physics', color: SUBJECT_COLOR_VALUES[1], description: '' })
    })
    let subId
    await waitFor(() => { subId = ctx.subjects[0]?.id })

    act(() => {
      ctx.addAssignment({
        title: 'Overdue Lab',
        subjectId: subId,
        dueDate: '2020-01-01',
        priority: 'high',
        status: 'todo',
        notes: '',
      })
    })

    let aId
    await waitFor(() => { aId = ctx.assignments[0]?.id })

    act(() => {
      ctx.updateAssignment(aId, { status: 'done' })
    })

    await waitFor(() => {
      const overdue = ctx.assignments.filter(a => {
        if (a.status === 'done') return false
        return new Date(a.dueDate) < new Date()
      })
      expect(overdue).toHaveLength(0)
    })
  })
})
