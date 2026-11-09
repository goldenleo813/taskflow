import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TaskCard } from '../components/TaskCard'
import { Task } from '../types/task'

const baseTask: Task = {
  id: 'task-1',
  title: 'Sample Task',
  description: 'A test description',
  priority: 'medium',
  dueDate: null,
  completed: false,
  createdAt: '2026-11-01T00:00:00.000Z',
  updatedAt: '2026-11-01T00:00:00.000Z',
}

describe('TaskCard', () => {
  const onToggleComplete = vi.fn()
  const onUpdate = vi.fn()
  const onDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders task title and description', () => {
    render(
      <TaskCard
        task={baseTask}
        onToggleComplete={onToggleComplete}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    )
    expect(screen.getByTestId('task-title')).toHaveTextContent('Sample Task')
    expect(screen.getByTestId('task-description')).toHaveTextContent('A test description')
  })

  it('renders priority badge', () => {
    render(
      <TaskCard
        task={baseTask}
        onToggleComplete={onToggleComplete}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    )
    expect(screen.getByTestId('priority-badge')).toBeInTheDocument()
  })

  it('calls onToggleComplete when toggle button is clicked', () => {
    render(
      <TaskCard
        task={baseTask}
        onToggleComplete={onToggleComplete}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    )
    fireEvent.click(screen.getByTestId('toggle-complete-button'))
    expect(onToggleComplete).toHaveBeenCalledWith('task-1')
  })

  it('shows completed styles when task is completed', () => {
    const completedTask = { ...baseTask, completed: true }
    render(
      <TaskCard
        task={completedTask}
        onToggleComplete={onToggleComplete}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    )
    expect(screen.getByTestId('task-title')).toHaveClass('line-through')
  })

  it('shows edit form when edit button is clicked', () => {
    render(
      <TaskCard
        task={baseTask}
        onToggleComplete={onToggleComplete}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    )
    fireEvent.click(screen.getByTestId('edit-button'))
    expect(screen.getByTestId('task-card-editing')).toBeInTheDocument()
    expect(screen.getByTestId('task-form')).toBeInTheDocument()
  })

  it('calls onUpdate and closes edit form on submit', async () => {
    render(
      <TaskCard
        task={baseTask}
        onToggleComplete={onToggleComplete}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    )
    fireEvent.click(screen.getByTestId('edit-button'))
    fireEvent.click(screen.getByTestId('submit-button'))
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith('task-1', expect.objectContaining({ title: 'Sample Task' }))
    })
    expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
  })

  it('closes edit form on cancel', () => {
    render(
      <TaskCard
        task={baseTask}
        onToggleComplete={onToggleComplete}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    )
    fireEvent.click(screen.getByTestId('edit-button'))
    fireEvent.click(screen.getByTestId('cancel-button'))
    expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
  })

  it('shows delete confirmation when delete button is clicked', () => {
    render(
      <TaskCard
        task={baseTask}
        onToggleComplete={onToggleComplete}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    )
    fireEvent.click(screen.getByTestId('delete-button'))
    expect(screen.getByTestId('delete-confirm')).toBeInTheDocument()
  })

  it('calls onDelete when delete is confirmed', () => {
    render(
      <TaskCard
        task={baseTask}
        onToggleComplete={onToggleComplete}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    )
    fireEvent.click(screen.getByTestId('delete-button'))
    fireEvent.click(screen.getByTestId('confirm-delete-button'))
    expect(onDelete).toHaveBeenCalledWith('task-1')
  })

  it('cancels delete when No is clicked', () => {
    render(
      <TaskCard
        task={baseTask}
        onToggleComplete={onToggleComplete}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    )
    fireEvent.click(screen.getByTestId('delete-button'))
    fireEvent.click(screen.getByTestId('cancel-delete-button'))
    expect(screen.queryByTestId('delete-confirm')).not.toBeInTheDocument()
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('renders due date when provided', () => {
    const taskWithDate = { ...baseTask, dueDate: '2026-12-25' }
    render(
      <TaskCard
        task={taskWithDate}
        onToggleComplete={onToggleComplete}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    )
    expect(screen.getByTestId('task-due-date')).toBeInTheDocument()
  })

  it('does not render due date when not provided', () => {
    render(
      <TaskCard
        task={baseTask}
        onToggleComplete={onToggleComplete}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    )
    expect(screen.queryByTestId('task-due-date')).not.toBeInTheDocument()
  })

  it('does not render description element when description is empty', () => {
    const taskNoDesc = { ...baseTask, description: '' }
    render(
      <TaskCard
        task={taskNoDesc}
        onToggleComplete={onToggleComplete}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    )
    expect(screen.queryByTestId('task-description')).not.toBeInTheDocument()
  })
})
