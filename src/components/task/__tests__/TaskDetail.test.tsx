import { renderWithStore, screen, userEvent, render } from '@/test-utils'
import { TaskDetail } from '../TaskDetail'
import { useKanbanStore } from '@/stores/kanbanStore'
import { mockTask } from '@/test-utils'

// Mock Next.js router
const mockPush = jest.fn()
const mockBack = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  usePathname: () => '/task/TSK-001',
}))

describe('TaskDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('displays task not found message for non-existent task', () => {
    renderWithStore(<TaskDetail taskId="NON-EXISTENT" />)
    
    expect(screen.getByText('Task not found')).toBeInTheDocument()
    expect(screen.getByText("The task you're looking for doesn't exist.")).toBeInTheDocument()
  })

  test('displays task information when task exists', () => {
    // Set state directly to ensure task exists
    useKanbanStore.setState({
      tasks: [mockTask],
      filters: {
        search: '',
        assignee: null,
        tags: [],
      }
    })
    
    render(<TaskDetail taskId={mockTask.id} />)
    
    expect(screen.getByText(mockTask.title)).toBeInTheDocument()
    expect(screen.getByText(mockTask.description)).toBeInTheDocument()
    expect(screen.getByText(mockTask.assignee)).toBeInTheDocument()
  })

  test('back button navigates to previous page', async () => {
    const user = userEvent.setup()
    
    useKanbanStore.setState({
      tasks: [mockTask],
      filters: {
        search: '',
        assignee: null,
        tags: [],
      }
    })
    
    render(<TaskDetail taskId={mockTask.id} />)
    
    const backButton = screen.getByRole('button', { name: /back/i })
    await user.click(backButton)
    
    expect(mockBack).toHaveBeenCalledTimes(1)
  })

  test('handles task with no due date gracefully', () => {
    const taskWithoutDueDate = { ...mockTask, dueDate: undefined }
    
    useKanbanStore.setState({
      tasks: [taskWithoutDueDate],
      filters: {
        search: '',
        assignee: null,
        tags: [],
      }
    })
    
    render(<TaskDetail taskId={taskWithoutDueDate.id} />)
    
    // Should handle missing due date gracefully
    expect(screen.getByText(taskWithoutDueDate.title)).toBeInTheDocument()
  })

  test('handles task with empty tags gracefully', () => {
    const taskWithoutTags = { ...mockTask, tags: [] }
    
    useKanbanStore.setState({
      tasks: [taskWithoutTags],
      filters: {
        search: '',
        assignee: null,
        tags: [],
      }
    })
    
    render(<TaskDetail taskId={taskWithoutTags.id} />)
    
    // Should handle empty tags gracefully
    expect(screen.getByText(taskWithoutTags.title)).toBeInTheDocument()
  })
})