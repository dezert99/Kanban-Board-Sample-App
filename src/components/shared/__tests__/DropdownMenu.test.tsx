import { render, screen, userEvent, fireEvent } from '@/test-utils'
import { DropdownMenu, TaskCardDropdown } from '../DropdownMenu'
import { Edit3, Trash2 } from 'lucide-react'

describe('DropdownMenu', () => {
  const mockItems = [
    {
      label: 'Edit',
      icon: <Edit3 className="w-4 h-4" />,
      onClick: jest.fn(),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: jest.fn(),
      variant: 'danger' as const,
    },
    {
      label: 'Archive',
      onClick: jest.fn(),
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders trigger button', () => {
    render(<DropdownMenu items={mockItems} />)
    
    const triggerButton = screen.getByRole('button', { name: 'More actions' })
    expect(triggerButton).toBeInTheDocument()
    expect(triggerButton).toHaveAttribute('title', 'More actions')
  })

  test('opens dropdown when trigger is clicked', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu items={mockItems} />)
    
    const triggerButton = screen.getByRole('button', { name: 'More actions' })
    
    // Initially dropdown should not be visible
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    
    await user.click(triggerButton)
    
    // After click, dropdown should be visible
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
    expect(screen.getByText('Archive')).toBeInTheDocument()
  })

  test('closes dropdown when trigger is clicked again', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu items={mockItems} />)
    
    const triggerButton = screen.getByRole('button', { name: 'More actions' })
    
    // Open dropdown
    await user.click(triggerButton)
    expect(screen.getByText('Edit')).toBeInTheDocument()
    
    // Close dropdown
    await user.click(triggerButton)
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })

  test('calls item onClick and closes dropdown when item is clicked', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu items={mockItems} />)
    
    const triggerButton = screen.getByRole('button', { name: 'More actions' })
    await user.click(triggerButton)
    
    const editButton = screen.getByText('Edit')
    await user.click(editButton)
    
    expect(mockItems[0].onClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })

  test('applies danger styling to danger variant items', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu items={mockItems} />)
    
    const triggerButton = screen.getByRole('button', { name: 'More actions' })
    await user.click(triggerButton)
    
    const deleteButton = screen.getByText('Delete')
    expect(deleteButton).toHaveClass('text-red-600')
  })

  test('renders icons when provided', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu items={mockItems} />)
    
    const triggerButton = screen.getByRole('button', { name: 'More actions' })
    await user.click(triggerButton)
    
    // Edit and Delete should have icons, Archive should not
    const editButton = screen.getByText('Edit').closest('button')
    const deleteButton = screen.getByText('Delete').closest('button')
    const archiveButton = screen.getByText('Archive').closest('button')
    
    expect(editButton?.querySelector('span')).toBeInTheDocument()
    expect(deleteButton?.querySelector('span')).toBeInTheDocument()
    expect(archiveButton?.querySelector('span')).not.toBeInTheDocument()
  })

  test('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <DropdownMenu items={mockItems} />
        <div data-testid="outside">Outside element</div>
      </div>
    )
    
    const triggerButton = screen.getByRole('button', { name: 'More actions' })
    await user.click(triggerButton)
    
    expect(screen.getByText('Edit')).toBeInTheDocument()
    
    // Click outside
    const outsideElement = screen.getByTestId('outside')
    fireEvent.mouseDown(outsideElement)
    
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })

  test('applies custom className', () => {
    const { container } = render(<DropdownMenu items={mockItems} className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  test('stops propagation on trigger click', async () => {
    const parentClickHandler = jest.fn()
    const user = userEvent.setup()
    
    render(
      <div onClick={parentClickHandler}>
        <DropdownMenu items={mockItems} />
      </div>
    )
    
    const triggerButton = screen.getByRole('button', { name: 'More actions' })
    await user.click(triggerButton)
    
    expect(parentClickHandler).not.toHaveBeenCalled()
  })
})

describe('TaskCardDropdown', () => {
  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders with edit and delete options', async () => {
    const user = userEvent.setup()
    render(<TaskCardDropdown onEdit={mockOnEdit} onDelete={mockOnDelete} />)
    
    const triggerButton = screen.getByRole('button', { name: 'More actions' })
    await user.click(triggerButton)
    
    expect(screen.getByText('Edit task')).toBeInTheDocument()
    expect(screen.getByText('Delete task')).toBeInTheDocument()
  })

  test('calls onEdit when edit is clicked', async () => {
    const user = userEvent.setup()
    render(<TaskCardDropdown onEdit={mockOnEdit} onDelete={mockOnDelete} />)
    
    const triggerButton = screen.getByRole('button', { name: 'More actions' })
    await user.click(triggerButton)
    
    const editButton = screen.getByText('Edit task')
    await user.click(editButton)
    
    expect(mockOnEdit).toHaveBeenCalledTimes(1)
  })

  test('calls onDelete when delete is clicked', async () => {
    const user = userEvent.setup()
    render(<TaskCardDropdown onEdit={mockOnEdit} onDelete={mockOnDelete} />)
    
    const triggerButton = screen.getByRole('button', { name: 'More actions' })
    await user.click(triggerButton)
    
    const deleteButton = screen.getByText('Delete task')
    await user.click(deleteButton)
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1)
  })

  test('delete option has danger styling', async () => {
    const user = userEvent.setup()
    render(<TaskCardDropdown onEdit={mockOnEdit} onDelete={mockOnDelete} />)
    
    const triggerButton = screen.getByRole('button', { name: 'More actions' })
    await user.click(triggerButton)
    
    const deleteButton = screen.getByText('Delete task')
    expect(deleteButton).toHaveClass('text-red-600')
  })

  test('applies custom className', () => {
    const { container } = render(
      <TaskCardDropdown 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        className="custom-task-dropdown" 
      />
    )
    
    expect(container.firstChild).toHaveClass('custom-task-dropdown')
  })
})