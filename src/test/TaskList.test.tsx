import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TaskList } from '../components/TaskList'
import { Task } from '../types/task'

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'task-1',
  title: 'Default Task',
  description: '',
  priority: 'medium',
  dueDate: null,
  completed: false,
  createdAt: '2026-11-01T00:00:00.000Z',
  updatedAt: '2026-11-01T00:00:00.000Z',
  ...overrides,
})

describe('TaskList', () => {
  const noop = vi.fn()

  it('renders empty state when no tasks', () => {
    render(<TaskList tasks={[]} onToggleComplete={noop} onUpdate={noop} onDelete={noop} />)
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByText('No tasks yet')).toBeInTheDocument()
  })

  it('renders task list when tasks exist', () => {
    const tasks = [makeTask({ id: 'task-1', title: 'Task A' })]
    render(<TaskList tasks={tasks} onToggleComplete={noop} onUpdate={noop} onDelete={noop} />)
    expect(screen.getByTestId('task-list')).toBeInTheDocument()
    expect(screen.getByText('Task A')).toBeInTheDocument()
  })

  it('renders active and completed sections separately', () => {
    const tasks = [
      makeTask({ id: 'task-1', title: 'Active Task', completed: false }),
      makeTask({ id: 'task-2', title: 'Done Task', completed: true }),
    ]
    render(<TaskList tasks={tasks} onToggleComplete={noop} onUpdate={noop} onDelete={noop} />)
    expect(screen.getByText(/Active \(1\)/)).toBeInTheDocument()
    expect(screen.getByText(/Completed \(1\)/)).toBeInTheDocument()
  })

  it('does not show Completed section when all tasks are active', () => {
    const tasks = [makeTask({ id: 'task-1', completed: false })]
    render(<TaskList tasks={tasks} onToggleComplete={noop} onUpdate={noop} onDelete={noop} />)
    expect(screen.queryByText(/Completed/)).not.toBeInTheDocument()
  })

  it('does not show Active section when all tasks are completed', () => {
    const tasks = [makeTask({ id: 'task-1', completed: true })]
    render(<TaskList tasks={tasks} onToggleComplete={noop} onUpdate={noop} onDelete={noop} />)
    expect(screen.queryByText(/Active/)).not.toBeInTheDocument()
  })

  it('renders correct count in section headings', () => {
    const tasks = [
      makeTask({ id: 'task-1', completed: false }),
      makeTask({ id: 'task-2', completed: false }),
      makeTask({ id: 'task-3', completed: true }),
    ]
    render(<TaskList tasks={tasks} onToggleComplete={noop} onUpdate={noop} onDelete={noop} />)
    expect(screen.getByText(/Active \(2\)/)).toBeInTheDocument()
    expect(screen.getByText(/Completed \(1\)/)).toBeInTheDocument()
  })
})
