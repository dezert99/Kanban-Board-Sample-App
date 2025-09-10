import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { useKanbanStore } from '@/stores/kanbanStore'

// Mock localStorage for all tests
const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(() => null),
} as Storage
global.localStorage = localStorageMock

// Helper to reset store state
export const resetStore = () => {
  useKanbanStore.setState({
    tasks: [],
    filters: {
      search: '',
      assignee: null,
      tags: [],
    }
  })
}

// Custom render function with store reset
export const renderWithStore = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  // Reset store before each render
  resetStore()
  
  return render(ui, options)
}

// Re-export specific items from React Testing Library
export { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

// Sample test data
export const mockTask = {
  id: 'TSK-TEST',
  title: 'Test Task',
  description: 'Test task description',
  status: 'scheduled' as const,
  assignee: 'John Doe',
  priority: 'medium' as const,
  tags: ['test', 'frontend'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  sortOrder: 0,
}

export const mockTasks = [
  mockTask,
  {
    ...mockTask,
    id: 'TSK-TEST-2',
    title: 'Second Test Task',
    status: 'in-progress' as const,
    sortOrder: 1,
  },
  {
    ...mockTask,
    id: 'TSK-TEST-3',
    title: 'Third Test Task', 
    status: 'done' as const,
    sortOrder: 2,
  },
]