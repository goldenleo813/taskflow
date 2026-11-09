import { useState } from 'react'
import { useTasks } from './hooks/useTasks'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks()
  const [showForm, setShowForm] = useState(false)

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const activeTasks = totalTasks - completedTasks

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">TaskFlow</span>
          </div>

          <div className="flex items-center gap-4">
            {totalTasks > 0 && (
              <div className="hidden sm:flex items-center gap-3 text-sm text-gray-500">
                <span>
                  <span className="font-semibold text-blue-600">{activeTasks}</span> active
                </span>
                <span>·</span>
                <span>
                  <span className="font-semibold text-green-600">{completedTasks}</span> done
                </span>
              </div>
            )}
            <button
              onClick={() => setShowForm((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                showForm
                  ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                  : 'text-white bg-blue-600 hover:bg-blue-700'
              }`}
              data-testid="toggle-form-button"
            >
              {showForm ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  New Task
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {showForm && (
          <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-5" data-testid="add-task-panel">
            <h2 className="text-base font-semibold text-gray-800 mb-4">New Task</h2>
            <TaskForm
              onSubmit={(data) => {
                addTask(data)
                setShowForm(false)
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <TaskList
          tasks={tasks}
          onToggleComplete={toggleComplete}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </main>
    </div>
  )
}
