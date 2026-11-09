import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useLocalStorage } from '../hooks/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', ''))
    act(() => {
      result.current[1]('hello')
    })
    expect(localStorage.getItem('test-key')).toBe('"hello"')
  })

  it('reads existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify(42))
    const { result } = renderHook(() => useLocalStorage('test-key', 0))
    expect(result.current[0]).toBe(42)
  })

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', [1, 2]))
    act(() => {
      result.current[1]((prev) => [...prev, 3])
    })
    expect(result.current[0]).toEqual([1, 2, 3])
  })

  it('handles corrupt localStorage data gracefully', () => {
    localStorage.setItem('test-key', 'not-valid-json{{{')
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })
})
