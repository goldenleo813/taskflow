import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import App from '../App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the TaskFlow header', () => {
    render(<App />)
    expect(screen.getByText('TaskFlow')).toBeInTheDocument()
  })

  it('renders New Task button', () => {
    render(<App />)
    expect(screen.getByTestId('toggle-form-button')).toHaveTextContent('New Task')
  })

  it('shows empty state initially', () => {
    render(<App />)
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('shows task form when New Task button is clicked', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('toggle-form-button'))
    expect(screen.getByTestId('add-task-panel')).toBeInTheDocument()
    expect(screen.getByTestId('task-form')).toBeInTheDocument()
  })

  it('hides task form when Cancel is clicked in header', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('toggle-form-button'))
    fireEvent.click(screen.getByTestId('toggle-form-button'))
    expect(screen.queryByTestId('add-task-panel')).not.toBeInTheDocument()
  })

  it('adds a task and shows it in the list', async () => {
    const user = userEvent.setup()
    render(<App />)

    fireEvent.click(screen.getByTestId('toggle-form-button'))
    await user.type(screen.getByTestId('task-title-input'), 'My New Task')
    fireEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(screen.getByText('My New Task')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('add-task-panel')).not.toBeInTheDocument()
  })

  it('shows active/completed counts in header after adding tasks', async () => {
    const user = userEvent.setup()
    render(<App />)

    fireEvent.click(screen.getByTestId('toggle-form-button'))
    await user.type(screen.getByTestId('task-title-input'), 'Task One')
    fireEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  it('closes form via cancel button inside form', async () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('toggle-form-button'))
    expect(screen.getByTestId('add-task-panel')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('cancel-button'))
    await waitFor(() => {
      expect(screen.queryByTestId('add-task-panel')).not.toBeInTheDocument()
    })
  })
})
