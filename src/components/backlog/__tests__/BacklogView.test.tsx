import { screen, userEvent, render } from '@/test-utils'
import { BacklogView } from '../BacklogView'
import { useKanbanStore } from '@/stores/kanbanStore'
import { Task } from '@/types'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
    return (
      <a 
        href={href} 
        onClick={(e) => {
          e.preventDefault()
          mockPush(href)
        }}
        {...props}
      >
        {children}
      </a>
    )
  }
})

describe('BacklogView', () => {
  const mockTasks: Task[] = [
    {
      id: 'TSK-001',
      title: 'First Task',
      description: 'First task description',
      status: 'scheduled',
      assignee: 'John Doe',
      priority: 'high',
      tags: ['frontend', 'urgent'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      dueDate: new Date('2024-12-31'),
      sortOrder: 0,
    },
    {
      id: 'TSK-002', 
      title: 'Second Task',
      description: 'Second task description',
      status: 'in-progress',
      assignee: 'Jane Smith',
      priority: 'medium',
      tags: ['backend'],
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      sortOrder: 1,
    },
    {
      id: 'TSK-003',
      title: 'Third Task', 
      description: 'Third task description',
      status: 'done',
      assignee: 'Bob Wilson',
      tags: [],
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
      sortOrder: 2,
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset store with test data
    useKanbanStore.setState({
      tasks: mockTasks,
      filters: {
        search: '',
        assignee: null,
        tags: [],
      }
    })
  })

  test('renders table headers correctly', () => {
    render(<BacklogView />)
    
    expect(screen.getByText('Task')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Assignee')).toBeInTheDocument()
    expect(screen.getByText('Priority')).toBeInTheDocument()
    expect(screen.getByText('Due Date')).toBeInTheDocument()
    expect(screen.getByText('Tags')).toBeInTheDocument()
  })

  test('displays all tasks when no filters applied', () => {
    render(<BacklogView />)
    
    expect(screen.getByText('First Task')).toBeInTheDocument()
    expect(screen.getByText('Second Task')).toBeInTheDocument()
    expect(screen.getByText('Third Task')).toBeInTheDocument()
    
    expect(screen.getByText('Showing 3 tasks')).toBeInTheDocument()
  })

  test('displays task details correctly', () => {
    render(<BacklogView />)
    
    // Check task titles and descriptions
    expect(screen.getByText('First Task')).toBeInTheDocument()
    expect(screen.getByText('First task description')).toBeInTheDocument()
    
    // Check task IDs
    expect(screen.getByText('TSK-001')).toBeInTheDocument()
    
    // Check assignees
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    
    // Check due date formatting (allowing for different formats)
    expect(screen.getByText(/Dec 3[01], 2024/)).toBeInTheDocument()
  })

  test('renders status badges correctly', () => {
    render(<BacklogView />)
    
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  test('renders priority badges correctly', () => {
    render(<BacklogView />)
    
    expect(screen.getByText('high')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
    
    // Third task has no priority, should show dash
    const priorityCells = screen.getAllByText('-')
    expect(priorityCells.length).toBeGreaterThan(0)
  })

  test('renders tags correctly', () => {
    render(<BacklogView />)
    
    expect(screen.getByText('frontend')).toBeInTheDocument()
    expect(screen.getByText('urgent')).toBeInTheDocument()
    expect(screen.getByText('backend')).toBeInTheDocument()
  })

  test('handles tasks with no due date', () => {
    render(<BacklogView />)
    
    // Tasks without due date should show dash
    const dashElements = screen.getAllByText('-')
    expect(dashElements.length).toBeGreaterThan(0)
  })

  test('handles tasks with empty tags', () => {
    render(<BacklogView />)
    
    // Third task has empty tags array, should show dash
    const dashElements = screen.getAllByText('-')
    expect(dashElements.length).toBeGreaterThan(0)
  })

  test('filters tasks by search term', () => {
    // Set search filter
    useKanbanStore.setState({
      tasks: mockTasks,
      filters: {
        search: 'first',
        assignee: null,
        tags: [],
      }
    })
    
    render(<BacklogView />)
    
    expect(screen.getByText('First Task')).toBeInTheDocument()
    expect(screen.queryByText('Second Task')).not.toBeInTheDocument()
    expect(screen.queryByText('Third Task')).not.toBeInTheDocument()
    
    expect(screen.getByText('Showing 1 task')).toBeInTheDocument()
  })

  test('filters tasks by assignee', () => {
    // Set assignee filter
    useKanbanStore.setState({
      tasks: mockTasks,
      filters: {
        search: '',
        assignee: 'John Doe',
        tags: [],
      }
    })
    
    render(<BacklogView />)
    
    expect(screen.getByText('First Task')).toBeInTheDocument()
    expect(screen.queryByText('Second Task')).not.toBeInTheDocument()
    expect(screen.queryByText('Third Task')).not.toBeInTheDocument()
    
    expect(screen.getByText('Showing 1 task')).toBeInTheDocument()
  })

  test('filters tasks by tags', () => {
    // Set tag filter
    useKanbanStore.setState({
      tasks: mockTasks,
      filters: {
        search: '',
        assignee: null,
        tags: ['frontend'],
      }
    })
    
    render(<BacklogView />)
    
    expect(screen.getByText('First Task')).toBeInTheDocument()
    expect(screen.queryByText('Second Task')).not.toBeInTheDocument()
    expect(screen.queryByText('Third Task')).not.toBeInTheDocument()
    
    expect(screen.getByText('Showing 1 task')).toBeInTheDocument()
  })

  test('shows empty state when no tasks match filters', () => {
    // Set filter that matches no tasks
    useKanbanStore.setState({
      tasks: mockTasks,
      filters: {
        search: 'nonexistent',
        assignee: null,
        tags: [],
      }
    })
    
    render(<BacklogView />)
    
    expect(screen.getByText('No tasks found matching current filters')).toBeInTheDocument()
    expect(screen.queryByText('Showing')).not.toBeInTheDocument()
  })

  test('shows empty state when no tasks exist', () => {
    useKanbanStore.setState({
      tasks: [],
      filters: {
        search: '',
        assignee: null,
        tags: [],
      }
    })
    
    render(<BacklogView />)
    
    expect(screen.getByText('No tasks found matching current filters')).toBeInTheDocument()
  })

  test('task links navigate to task detail page', async () => {
    const user = userEvent.setup()
    
    render(<BacklogView />)
    
    const taskLink = screen.getByRole('link', { name: /First Task/ })
    await user.click(taskLink)
    
    expect(mockPush).toHaveBeenCalledWith('/task/TSK-001')
  })

  test('view links navigate to task detail page', async () => {
    const user = userEvent.setup()
    
    render(<BacklogView />)
    
    const viewLinks = screen.getAllByRole('link', { name: 'View' })
    await user.click(viewLinks[0])
    
    expect(mockPush).toHaveBeenCalledWith('/task/TSK-001')
  })

  test('displays assignee initials correctly', () => {
    render(<BacklogView />)
    
    // John Doe should show "JD"
    expect(screen.getByText('JD')).toBeInTheDocument()
    // Jane Smith should show "JS" 
    expect(screen.getByText('JS')).toBeInTheDocument()
    // Bob Wilson should show "BW"
    expect(screen.getByText('BW')).toBeInTheDocument()
  })

  test('combines multiple filters correctly', () => {
    // Set multiple filters
    useKanbanStore.setState({
      tasks: mockTasks,
      filters: {
        search: 'first',
        assignee: 'John Doe',
        tags: ['frontend'],
      }
    })
    
    render(<BacklogView />)
    
    expect(screen.getByText('First Task')).toBeInTheDocument()
    expect(screen.queryByText('Second Task')).not.toBeInTheDocument()
    expect(screen.queryByText('Third Task')).not.toBeInTheDocument()
    
    expect(screen.getByText('Showing 1 task')).toBeInTheDocument()
  })

  test('handles hover effects on table rows', () => {
    const { container } = render(<BacklogView />)
    
    const tableRows = container.querySelectorAll('tbody tr')
    expect(tableRows[0]).toHaveClass('hover:bg-gray-50')
  })

  test('displays correct singular/plural task count', () => {
    // Test single task
    useKanbanStore.setState({
      tasks: [mockTasks[0]],
      filters: {
        search: '',
        assignee: null,
        tags: [],
      }
    })
    
    const { unmount } = render(<BacklogView />)
    expect(screen.getByText('Showing 1 task')).toBeInTheDocument()
    unmount()
    
    // Test multiple tasks 
    useKanbanStore.setState({
      tasks: mockTasks,
      filters: {
        search: '',
        assignee: null,
        tags: [],
      }
    })
    
    render(<BacklogView />)
    expect(screen.getByText('Showing 3 tasks')).toBeInTheDocument()
  })
})