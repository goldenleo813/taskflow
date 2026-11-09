import { useCallback } from 'react'
import { Task, TaskFormData } from '../types/task'
import { useLocalStorage } from './useLocalStorage'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow-tasks', [])

  const addTask = useCallback((data: TaskFormData) => {
    const now = new Date().toISOString()
    const newTask: Task = {
      ...data,
      id: generateId(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    }
    setTasks((prev) => [newTask, ...prev])
  }, [setTasks])

  const updateTask = useCallback((id: string, data: TaskFormData) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, ...data, updatedAt: new Date().toISOString() }
          : task,
      ),
    )
  }, [setTasks])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }, [setTasks])

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
          : task,
      ),
    )
  }, [setTasks])

  return { tasks, addTask, updateTask, deleteTask, toggleComplete }
}
