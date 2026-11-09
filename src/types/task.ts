export type Priority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
}

export type TaskFormData = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'>
