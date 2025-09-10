import { renderWithStore, screen, userEvent } from '@/test-utils'
import { TaskCard } from '../TaskCard'
import { mockTask } from '@/test-utils'
import { useKanbanStore } from '@/stores/kanbanStore'

// Mock @dnd-kit hooks
jest.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}))

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('TaskCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders task information', () => {
    renderWithStore(<TaskCard task={mockTask} />)
    
    expect(screen.getByText(mockTask.title)).toBeInTheDocument()
    expect(screen.getByText(mockTask.description)).toBeInTheDocument()
    expect(screen.getByText(mockTask.id)).toBeInTheDocument()
    expect(screen.getByText(mockTask.assignee)).toBeInTheDocument()
  })

  test('renders task tags', () => {
    renderWithStore(<TaskCard task={mockTask} />)
    
    mockTask.tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument()
    })
  })

  test('renders assignee initials', () => {
    renderWithStore(<TaskCard task={mockTask} />)
    
    // John Doe should show "JD"
    const initialsElement = screen.getByText('JD')
    expect(initialsElement).toBeInTheDocument()
  })

  test('renders due date when present', () => {
    const taskWithDueDate = {
      ...mockTask,
      dueDate: new Date('2024-12-25')
    }
    
    const { container } = renderWithStore(<TaskCard task={taskWithDueDate} />)
    
    // Check for any date-related class or content instead of specific text
    const hasDateContent = container.textContent?.includes('2024') || 
                          container.textContent?.includes('Dec') ||
                          container.querySelector('[class*="bg-blue-100"]') ||
                          container.querySelector('[class*="bg-orange-100"]') ||
                          container.querySelector('[class*="bg-red-100"]')
    
    expect(hasDateContent).toBeTruthy()
  })

  test('does not render due date when not present', () => {
    const taskWithoutDueDate = {
      ...mockTask,
      dueDate: undefined
    }
    
    renderWithStore(<TaskCard task={taskWithoutDueDate} />)
    
    // Should not have any date strings
    expect(screen.queryByText(/\d{4}/)).not.toBeInTheDocument()
  })

  test('applies correct priority border color for medium priority', () => {
    const { container } = renderWithStore(<TaskCard task={mockTask} />)
    
    const cardElement = container.querySelector('.border-l-yellow-500')
    expect(cardElement).toBeInTheDocument()
  })

  test('applies correct priority border color for high priority', () => {
    const highPriorityTask = { ...mockTask, priority: 'high' as const }
    const { container } = renderWithStore(<TaskCard task={highPriorityTask} />)
    
    const cardElement = container.querySelector('.border-l-orange-500')
    expect(cardElement).toBeInTheDocument()
  })

  test('applies correct priority border color for low priority', () => {
    const lowPriorityTask = { ...mockTask, priority: 'low' as const }
    const { container } = renderWithStore(<TaskCard task={lowPriorityTask} />)
    
    const cardElement = container.querySelector('.border-l-green-500')
    expect(cardElement).toBeInTheDocument()
  })

  test('applies correct priority border color for critical priority', () => {
    const criticalPriorityTask = { ...mockTask, priority: 'critical' as const }
    const { container } = renderWithStore(<TaskCard task={criticalPriorityTask} />)
    
    const cardElement = container.querySelector('.border-l-red-500')
    expect(cardElement).toBeInTheDocument()
  })

  test('navigates to task detail when card is clicked', async () => {
    const user = userEvent.setup()
    renderWithStore(<TaskCard task={mockTask} />)
    
    const cardElement = screen.getByText(mockTask.title).closest('div')
    await user.click(cardElement!)
    
    expect(mockPush).toHaveBeenCalledWith(`/task/${mockTask.id}`)
  })

  test('opens edit modal when edit is clicked', async () => {
    const user = userEvent.setup()
    renderWithStore(<TaskCard task={mockTask} />)
    
    // Click dropdown menu
    const moreButton = screen.getByRole('button', { name: 'More actions' })
    await user.click(moreButton)
    
    // Click edit
    const editButton = screen.getByText('Edit task')
    await user.click(editButton)
    
    // Modal should be open (check for modal elements)
    expect(screen.getByText('Edit Task')).toBeInTheDocument()
  })

  test('opens delete confirmation when delete is clicked', async () => {
    const user = userEvent.setup()
    renderWithStore(<TaskCard task={mockTask} />)
    
    // Click dropdown menu
    const moreButton = screen.getByRole('button', { name: 'More actions' })
    await user.click(moreButton)
    
    // Click delete
    const deleteButton = screen.getByText('Delete task')
    await user.click(deleteButton)
    
    // Confirmation modal should be open
    expect(screen.getByText('Delete Task')).toBeInTheDocument()
    expect(screen.getByText(`Are you sure you want to delete "${mockTask.title}"? This action cannot be undone.`)).toBeInTheDocument()
  })

  test('deletes task when deletion is confirmed', async () => {
    const user = userEvent.setup()
    
    // Add task to store first
    useKanbanStore.getState().addTask(mockTask)
    
    renderWithStore(<TaskCard task={mockTask} />)
    
    // Open delete confirmation
    const moreButton = screen.getByRole('button', { name: 'More actions' })
    await user.click(moreButton)
    
    const deleteButton = screen.getByText('Delete task')
    await user.click(deleteButton)
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: 'Delete' })
    await user.click(confirmButton)
    
    // Task should be removed from store
    const store = useKanbanStore.getState()
    expect(store.tasks.find(t => t.id === mockTask.id)).toBeUndefined()
  })

  test('cancels deletion when cancel is clicked', async () => {
    const user = userEvent.setup()
    renderWithStore(<TaskCard task={mockTask} />)
    
    // Add task to store after rendering
    useKanbanStore.getState().addTask(mockTask)
    const initialTaskCount = useKanbanStore.getState().tasks.length
    
    // Open delete confirmation
    const moreButton = screen.getByRole('button', { name: 'More actions' })
    await user.click(moreButton)
    
    const deleteButton = screen.getByText('Delete task')
    await user.click(deleteButton)
    
    // Cancel deletion
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)
    
    // Task count should remain the same
    const store = useKanbanStore.getState()
    expect(store.tasks.length).toBe(initialTaskCount)
    
    // Modal should be closed
    expect(screen.queryByText('Delete Task')).not.toBeInTheDocument()
  })

  test('handles task with empty tags array', () => {
    const taskWithoutTags = { ...mockTask, tags: [] }
    
    renderWithStore(<TaskCard task={taskWithoutTags} />)
    
    expect(screen.getByText(taskWithoutTags.title)).toBeInTheDocument()
    // Should not crash and should still render the card
  })

  test('handles single-name assignee', () => {
    const taskWithSingleName = { ...mockTask, assignee: 'Alice' }
    
    renderWithStore(<TaskCard task={taskWithSingleName} />)
    
    // Should show "A" for single name
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  test('shows correct due date styling for overdue tasks', () => {
    const overdueTask = {
      ...mockTask,
      dueDate: new Date('2020-01-01') // Past date
    }
    
    const { container } = renderWithStore(<TaskCard task={overdueTask} />)
    
    // Should have red styling for overdue
    const dueDateElement = container.querySelector('.bg-red-100.text-red-700')
    expect(dueDateElement).toBeInTheDocument()
  })

  test('shows correct due date styling for due soon tasks', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const dueSoonTask = {
      ...mockTask,
      dueDate: tomorrow
    }
    
    const { container } = renderWithStore(<TaskCard task={dueSoonTask} />)
    
    // Should have orange styling for due soon
    const dueDateElement = container.querySelector('.bg-orange-100.text-orange-700')
    expect(dueDateElement).toBeInTheDocument()
  })

  test('shows correct due date styling for future tasks', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7) // Next week
    
    const futureTask = {
      ...mockTask,
      dueDate: futureDate
    }
    
    const { container } = renderWithStore(<TaskCard task={futureTask} />)
    
    // Should have blue styling for future
    const dueDateElement = container.querySelector('.bg-blue-100.text-blue-700')
    expect(dueDateElement).toBeInTheDocument()
  })
})