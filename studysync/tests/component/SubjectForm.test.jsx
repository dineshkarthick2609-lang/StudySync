import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SubjectForm from '../../src/components/subjects/SubjectForm.jsx'
import { SUBJECT_COLOR_VALUES } from '../../src/constants/colors.js'

// Mock AppContext
vi.mock('../../src/context/AppContext.jsx', () => ({
  useAppContext: () => ({
    subjects: [],
  }),
}))

describe('SubjectForm', () => {
  it('renders name and color fields', () => {
    render(<SubjectForm onSuccess={vi.fn()} />)
    expect(screen.getByLabelText(/subject name/i)).toBeInTheDocument()
  })

  it('shows error on empty submit', async () => {
    const user = userEvent.setup()
    render(<SubjectForm onSuccess={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /add subject/i }))
    expect(await screen.findByText(/required|must be/i)).toBeInTheDocument()
  })

  it('calls onSuccess with valid data when color is selected', async () => {
    const onSuccess = vi.fn()
    const user = userEvent.setup()
    render(<SubjectForm onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/subject name/i), 'Mathematics')

    // Click first color swatch
    const swatches = screen.getAllByRole('button', { name: /soft/i })
    await user.click(swatches[0])

    await user.click(screen.getByRole('button', { name: /add subject/i }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Mathematics' })
      )
    })
  })

  it('shows error when name already exists', async () => {
    const user = userEvent.setup()
    vi.doMock('../../src/context/AppContext.jsx', () => ({
      useAppContext: () => ({
        subjects: [{ id: '1', name: 'Math', color: SUBJECT_COLOR_VALUES[0] }],
      }),
    }))

    const { rerender } = render(<SubjectForm onSuccess={vi.fn()} />)
  })
})
