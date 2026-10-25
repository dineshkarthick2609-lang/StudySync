import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressCard from '../../src/components/progress/ProgressCard.jsx'

const subject = { id: 'sub1', name: 'Mathematics', color: '#6c9bcf' }

vi.mock('../../src/context/AppContext.jsx', () => ({
  useAppContext: vi.fn(),
}))

import { useAppContext } from '../../src/context/AppContext.jsx'

describe('ProgressCard', () => {
  it('renders 0% without crash when no assignments', () => {
    useAppContext.mockReturnValue({ assignments: [], sessions: [] })
    render(<ProgressCard subject={subject} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(screen.getByText('0 / 0 assignments')).toBeInTheDocument()
  })

  it('renders correct completion percentage', () => {
    useAppContext.mockReturnValue({
      assignments: [
        { id: 'a1', subjectId: 'sub1', status: 'done' },
        { id: 'a2', subjectId: 'sub1', status: 'todo' },
        { id: 'a3', subjectId: 'sub1', status: 'done' },
      ],
      sessions: [],
    })
    render(<ProgressCard subject={subject} />)
    expect(screen.getByText('66%')).toBeInTheDocument()
  })

  it('shows Complete badge at 100%', () => {
    useAppContext.mockReturnValue({
      assignments: [
        { id: 'a1', subjectId: 'sub1', status: 'done' },
        { id: 'a2', subjectId: 'sub1', status: 'done' },
      ],
      sessions: [],
    })
    render(<ProgressCard subject={subject} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('Complete')).toBeInTheDocument()
  })

  it('shows study session count and time', () => {
    useAppContext.mockReturnValue({
      assignments: [],
      sessions: [
        { id: 's1', subjectId: 'sub1', startTime: '09:00', endTime: '10:30' },
      ],
    })
    render(<ProgressCard subject={subject} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('1h 30m')).toBeInTheDocument()
  })
})
