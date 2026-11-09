import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TaskForm } from '../components/TaskForm'
import { Task } from '../types/task'

const mockTask: Task = {
  id: 'task-1',
  title: 'Existing Task',
  description: 'Existing description',
  priority: 'high',
  dueDate: '2026-12-01',
  completed: false,
  createdAt: '2026-11-01T00:00:00.000Z',
  updatedAt: '2026-11-01T00:00:00.000Z',
}

describe('TaskForm', () => {
  const onSubmit = vi.fn()
  const onCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty form for new task creation', () => {
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />)
    expect(screen.getByTestId('task-title-input')).toHaveValue('')
    expect(screen.getByTestId('task-description-input')).toHaveValue('')
    expect(screen.getByTestId('task-priority-select')).toHaveValue('medium')
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Add Task')
  })

  it('renders pre-filled form when editing', () => {
    render(<TaskForm initialData={mockTask} onSubmit={onSubmit} onCancel={onCancel} />)
    expect(screen.getByTestId('task-title-input')).toHaveValue('Existing Task')
    expect(screen.getByTestId('task-description-input')).toHaveValue('Existing description')
    expect(screen.getByTestId('task-priority-select')).toHaveValue('high')
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Update Task')
  })

  it('shows validation error when title is empty', async () => {
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />)
    fireEvent.click(screen.getByTestId('submit-button'))
    await waitFor(() => {
      expect(screen.getByTestId('title-error')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits form with correct data', async () => {
    const user = userEvent.setup()
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />)

    await user.type(screen.getByTestId('task-title-input'), 'New Task')
    await user.type(screen.getByTestId('task-description-input'), 'Some description')
    await user.selectOptions(screen.getByTestId('task-priority-select'), 'high')
    fireEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Some description',
        priority: 'high',
        dueDate: null,
      })
    })
  })

  it('trims whitespace from title and description', async () => {
    const user = userEvent.setup()
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />)

    await user.type(screen.getByTestId('task-title-input'), '  Trimmed Title  ')
    fireEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Trimmed Title' })
      )
    })
  })

  it('converts empty due date to null', async () => {
    const user = userEvent.setup()
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />)

    await user.type(screen.getByTestId('task-title-input'), 'Task')
    fireEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ dueDate: null })
      )
    })
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />)
    fireEvent.click(screen.getByTestId('cancel-button'))
    expect(onCancel).toHaveBeenCalled()
  })

  it('clears title error when user types', async () => {
    const user = userEvent.setup()
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />)

    fireEvent.click(screen.getByTestId('submit-button'))
    await waitFor(() => expect(screen.getByTestId('title-error')).toBeInTheDocument())

    await user.type(screen.getByTestId('task-title-input'), 'A')
    await waitFor(() => expect(screen.queryByTestId('title-error')).not.toBeInTheDocument())
  })
})
