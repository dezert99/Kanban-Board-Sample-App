import { render, screen, userEvent } from '@/test-utils'
import { 
  EmptyState, 
  NoTasksEmpty, 
  NoSearchResultsEmpty, 
  NoFilterResultsEmpty,
  TaskNotFoundEmpty,
  ErrorState,
  ColumnEmptyState 
} from '../EmptyState'

describe('EmptyState', () => {
  test('renders with custom title and message', () => {
    render(
      <EmptyState 
        title="Custom Title" 
        message="Custom message here"
      />
    )
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom message here')).toBeInTheDocument()
  })

  test('renders with default no-tasks type', () => {
    render(<EmptyState />)
    
    expect(screen.getByText('No tasks yet')).toBeInTheDocument()
    expect(screen.getByText('Get started by creating your first task to organize your work.')).toBeInTheDocument()
  })

  test('renders with task-not-found type', () => {
    render(<EmptyState type="task-not-found" />)
    
    expect(screen.getByText('Task not found')).toBeInTheDocument()
    expect(screen.getByText("The task you're looking for doesn't exist or has been deleted.")).toBeInTheDocument()
  })

  test('renders with no-search-results type', () => {
    render(<EmptyState type="no-search-results" />)
    
    expect(screen.getByText('No results found')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search terms or clearing filters to see more tasks.')).toBeInTheDocument()
  })

  test('renders with no-filter-results type', () => {
    render(<EmptyState type="no-filter-results" />)
    
    expect(screen.getByText('No tasks match your filters')).toBeInTheDocument()
    expect(screen.getByText('Try changing your filter criteria or clearing filters to see more tasks.')).toBeInTheDocument()
  })

  test('renders with error type', () => {
    render(<EmptyState type="error" />)
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('We encountered an error while loading your tasks. Please try again.')).toBeInTheDocument()
  })

  test('renders action button when provided', async () => {
    const user = userEvent.setup()
    const mockAction = jest.fn()
    
    render(
      <EmptyState 
        action={{
          label: 'Test Action',
          onClick: mockAction
        }}
      />
    )
    
    const button = screen.getByRole('button', { name: 'Test Action' })
    expect(button).toBeInTheDocument()
    
    await user.click(button)
    expect(mockAction).toHaveBeenCalledTimes(1)
  })

  test('applies custom className', () => {
    const { container } = render(<EmptyState className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('Specific EmptyState Components', () => {
  test('NoTasksEmpty renders with create action', async () => {
    const user = userEvent.setup()
    const mockCreate = jest.fn()
    
    render(<NoTasksEmpty onCreateTask={mockCreate} />)
    
    expect(screen.getByText('No tasks yet')).toBeInTheDocument()
    
    const createButton = screen.getByRole('button', { name: 'Create your first task' })
    await user.click(createButton)
    
    expect(mockCreate).toHaveBeenCalledTimes(1)
  })

  test('NoSearchResultsEmpty renders with clear action', async () => {
    const user = userEvent.setup()
    const mockClear = jest.fn()
    
    render(<NoSearchResultsEmpty onClearSearch={mockClear} />)
    
    expect(screen.getByText('No results found')).toBeInTheDocument()
    
    const clearButton = screen.getByRole('button', { name: 'Clear search' })
    await user.click(clearButton)
    
    expect(mockClear).toHaveBeenCalledTimes(1)
  })

  test('NoFilterResultsEmpty renders with clear filters action', async () => {
    const user = userEvent.setup()
    const mockClear = jest.fn()
    
    render(<NoFilterResultsEmpty onClearFilters={mockClear} />)
    
    expect(screen.getByText('No tasks match your filters')).toBeInTheDocument()
    
    const clearButton = screen.getByRole('button', { name: 'Clear filters' })
    await user.click(clearButton)
    
    expect(mockClear).toHaveBeenCalledTimes(1)
  })

  test('TaskNotFoundEmpty renders with back action', async () => {
    const user = userEvent.setup()
    const mockGoBack = jest.fn()
    
    render(<TaskNotFoundEmpty onGoBack={mockGoBack} />)
    
    expect(screen.getByText('Task not found')).toBeInTheDocument()
    
    const backButton = screen.getByRole('button', { name: 'Back to board' })
    await user.click(backButton)
    
    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  test('ErrorState renders with retry action', async () => {
    const user = userEvent.setup()
    const mockRetry = jest.fn()
    
    render(<ErrorState onRetry={mockRetry} />)
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    
    const retryButton = screen.getByRole('button', { name: 'Try again' })
    await user.click(retryButton)
    
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  test('ColumnEmptyState renders with column name and add task action', async () => {
    const user = userEvent.setup()
    const mockCreate = jest.fn()
    
    render(<ColumnEmptyState columnName="Scheduled" onCreateTask={mockCreate} />)
    
    expect(screen.getByText('No tasks in scheduled')).toBeInTheDocument()
    
    const addButton = screen.getByRole('button', { name: 'Add a task' })
    await user.click(addButton)
    
    expect(mockCreate).toHaveBeenCalledTimes(1)
  })
})