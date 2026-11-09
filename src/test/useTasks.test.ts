import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useTasks } from '../hooks/useTasks'

describe('useTasks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const baseData = {
    title: 'Test Task',
    description: 'A description',
    priority: 'medium' as const,
    dueDate: null,
  }

  it('starts with empty task list', () => {
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toEqual([])
  })

  it('adds a task with generated id and timestamps', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask(baseData)
    })
    expect(result.current.tasks).toHaveLength(1)
    const task = result.current.tasks[0]
    expect(task.title).toBe('Test Task')
    expect(task.completed).toBe(false)
    expect(task.id).toBeTruthy()
    expect(task.createdAt).toBeTruthy()
    expect(task.updatedAt).toBeTruthy()
  })

  it('prepends new tasks to the front', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask({ ...baseData, title: 'First' })
    })
    act(() => {
      result.current.addTask({ ...baseData, title: 'Second' })
    })
    expect(result.current.tasks[0].title).toBe('Second')
    expect(result.current.tasks[1].title).toBe('First')
  })

  it('toggles task completion', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask(baseData)
    })
    const id = result.current.tasks[0].id
    act(() => {
      result.current.toggleComplete(id)
    })
    expect(result.current.tasks[0].completed).toBe(true)
    act(() => {
      result.current.toggleComplete(id)
    })
    expect(result.current.tasks[0].completed).toBe(false)
  })

  it('updates a task', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask(baseData)
    })
    const id = result.current.tasks[0].id
    act(() => {
      result.current.updateTask(id, { ...baseData, title: 'Updated Title', priority: 'high' })
    })
    expect(result.current.tasks[0].title).toBe('Updated Title')
    expect(result.current.tasks[0].priority).toBe('high')
  })

  it('deletes a task', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask(baseData)
    })
    const id = result.current.tasks[0].id
    act(() => {
      result.current.deleteTask(id)
    })
    expect(result.current.tasks).toHaveLength(0)
  })

  it('persists tasks across hook re-mounts', () => {
    const { result, rerender } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask(baseData)
    })
    rerender()
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe('Test Task')
  })
})
