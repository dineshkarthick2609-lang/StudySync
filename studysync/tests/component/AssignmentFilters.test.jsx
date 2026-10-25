import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AssignmentFilters from '../../src/components/assignments/AssignmentFilters.jsx'

const mockSubjects = [
  { id: 'sub1', name: 'Mathematics', color: '#6c9bcf' },
]

vi.mock('../../src/context/AppContext.jsx', () => ({
  useAppContext: () => ({
    subjects: mockSubjects,
  }),
}))

describe('AssignmentFilters', () => {
  const defaultFilters = { subjectId: '', statuses: [], priorities: [] }

  it('renders filter controls', () => {
    render(<AssignmentFilters filters={defaultFilters} onChange={vi.fn()} />)
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /to-do/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /low/i })).toBeInTheDocument()
  })

  it('calls onChange when status button clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<AssignmentFilters filters={defaultFilters} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: /to-do/i }))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ statuses: ['todo'] })
    )
  })

  it('calls onChange when priority button clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<AssignmentFilters filters={defaultFilters} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: /^high$/i }))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ priorities: ['high'] })
    )
  })

  it('shows Clear Filters button when filters are active', () => {
    const activeFilters = { subjectId: 'sub1', statuses: [], priorities: [] }
    render(<AssignmentFilters filters={activeFilters} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument()
  })

  it('calls onChange with reset state when Clear Filters clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    const activeFilters = { subjectId: 'sub1', statuses: ['todo'], priorities: ['high'] }
    render(<AssignmentFilters filters={activeFilters} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: /clear filters/i }))
    expect(onChange).toHaveBeenCalledWith({ subjectId: '', statuses: [], priorities: [] })
  })
})
