import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PriorityBadge } from '../components/PriorityBadge'

describe('PriorityBadge', () => {
  it('renders High label for high priority', () => {
    render(<PriorityBadge priority="high" />)
    expect(screen.getByTestId('priority-badge')).toHaveTextContent('High')
  })

  it('renders Medium label for medium priority', () => {
    render(<PriorityBadge priority="medium" />)
    expect(screen.getByTestId('priority-badge')).toHaveTextContent('Medium')
  })

  it('renders Low label for low priority', () => {
    render(<PriorityBadge priority="low" />)
    expect(screen.getByTestId('priority-badge')).toHaveTextContent('Low')
  })

  it('applies red styling for high priority', () => {
    render(<PriorityBadge priority="high" />)
    const badge = screen.getByTestId('priority-badge')
    expect(badge.className).toContain('red')
  })

  it('applies yellow styling for medium priority', () => {
    render(<PriorityBadge priority="medium" />)
    const badge = screen.getByTestId('priority-badge')
    expect(badge.className).toContain('yellow')
  })

  it('applies green styling for low priority', () => {
    render(<PriorityBadge priority="low" />)
    const badge = screen.getByTestId('priority-badge')
    expect(badge.className).toContain('green')
  })
})
