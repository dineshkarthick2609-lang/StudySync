import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AssignmentForm from '../../src/components/assignments/AssignmentForm.jsx'

const mockSubjects = [
  { id: 'sub1', name: 'Mathematics', color: '#6c9bcf' },
  { id: 'sub2', name: 'Physics', color: '#9b8ec4' },
]

vi.mock('../../src/context/AppContext.jsx', () => ({
  useAppContext: () => ({
    subjects: mockSubjects,
  }),
}))

describe('AssignmentForm', () => {
  it('renders subject dropdown with subjects from context', () => {
    render(<AssignmentForm onSuccess={vi.fn()} />)
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
    expect(screen.getByText('Mathematics')).toBeInTheDocument()
    expect(screen.getByText('Physics')).toBeInTheDocument()
  })

  it('renders priority and status selects', () => {
    render(<AssignmentForm onSuccess={vi.fn()} />)
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
  })

  it('shows error on empty title submit', async () => {
    const user = userEvent.setup()
    render(<AssignmentForm onSuccess={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /add assignment/i }))
    expect(await screen.findByText(/required|must be/i)).toBeInTheDocument()
  })

  it('calls onSuccess with valid data', async () => {
    const onSuccess = vi.fn()
    const user = userEvent.setup()
    render(<AssignmentForm onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/title/i), 'Chapter 5 Homework')

    const subjectSelect = screen.getByLabelText(/subject/i)
    await user.selectOptions(subjectSelect, 'sub1')

    await user.click(screen.getByRole('button', { name: /add assignment/i }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Chapter 5 Homework', subjectId: 'sub1' })
      )
    })
  })
})
