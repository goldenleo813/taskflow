import { useState } from 'react'
import { Task, TaskFormData } from '../types/task'
import { PriorityBadge } from './PriorityBadge'
import { TaskForm } from './TaskForm'

interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string) => void
  onUpdate: (id: string, data: TaskFormData) => void
  onDelete: (id: string) => void
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isOverdue(dateStr: string, completed: boolean): boolean {
  if (completed) return false
  const [year, month, day] = dateStr.split('-').map(Number)
  const due = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}

export function TaskCard({ task, onToggleComplete, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-4" data-testid="task-card-editing">
        <TaskForm
          initialData={task}
          onSubmit={(data) => {
            onUpdate(task.id, data)
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    )
  }

  const overdue = task.dueDate ? isOverdue(task.dueDate, task.completed) : false

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm p-4 transition-all ${
        task.completed ? 'opacity-60 border-gray-200' : 'border-gray-200 hover:border-blue-200 hover:shadow-md'
      }`}
      data-testid="task-card"
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
            task.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400'
          }`}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          data-testid="toggle-complete-button"
        >
          {task.completed && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-sm font-semibold text-gray-900 leading-tight ${
                task.completed ? 'line-through text-gray-400' : ''
              }`}
              data-testid="task-title"
            >
              {task.title}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <PriorityBadge priority={task.priority} />
            </div>
          </div>

          {task.description && (
            <p
              className={`mt-1 text-xs leading-relaxed ${
                task.completed ? 'text-gray-400' : 'text-gray-500'
              }`}
              data-testid="task-description"
            >
              {task.description}
            </p>
          )}

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {task.dueDate && (
                <span
                  className={`text-xs flex items-center gap-1 ${
                    overdue ? 'text-red-500 font-medium' : 'text-gray-400'
                  }`}
                  data-testid="task-due-date"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Edit task"
                data-testid="edit-button"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Delete task"
                  data-testid="delete-button"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              ) : (
                <div className="flex items-center gap-1 ml-1" data-testid="delete-confirm">
                  <span className="text-xs text-gray-500">Delete?</span>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                    data-testid="confirm-delete-button"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    data-testid="cancel-delete-button"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
