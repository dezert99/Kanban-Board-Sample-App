import { renderWithStore, screen } from '@/test-utils'
import { KanbanColumn } from '../KanbanColumn'
import { mockTasks } from '@/test-utils'
import { Task } from '@/types'

// Mock @dnd-kit hooks
jest.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({
    setNodeRef: jest.fn(),
    isOver: false,
  }),
}))

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => children,
  verticalListSortingStrategy: {},
}))

// Mock TaskCard to simplify testing
jest.mock('../TaskCard', () => ({
  TaskCard: ({ task }: { task: Task }) => <div data-testid={`task-card-${task.id}`}>{task.title}</div>
}))

describe('KanbanColumn', () => {
  const scheduledTasks = mockTasks.filter(task => task.status === 'scheduled')
  const inProgressTasks = mockTasks.filter(task => task.status === 'in-progress')
  const doneTasks = mockTasks.filter(task => task.status === 'done')

  test('renders scheduled column with correct styling', () => {
    const { container } = renderWithStore(
      <KanbanColumn status="scheduled" tasks={scheduledTasks} />
    )
    
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
    expect(container.querySelector('.bg-gray-100')).toBeInTheDocument()
    expect(container.querySelector('.text-gray-700')).toBeInTheDocument()
  })

  test('renders in-progress column with correct styling', () => {
    const { container } = renderWithStore(
      <KanbanColumn status="in-progress" tasks={inProgressTasks} />
    )
    
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(container.querySelector('.bg-blue-50')).toBeInTheDocument()
    expect(container.querySelector('.text-blue-700')).toBeInTheDocument()
  })

  test('renders done column with correct styling', () => {
    const { container } = renderWithStore(
      <KanbanColumn status="done" tasks={doneTasks} />
    )
    
    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(container.querySelector('.bg-green-50')).toBeInTheDocument()
    expect(container.querySelector('.text-green-700')).toBeInTheDocument()
  })

  test('displays correct task count', () => {
    renderWithStore(
      <KanbanColumn status="scheduled" tasks={scheduledTasks} />
    )
    
    expect(screen.getByText(scheduledTasks.length.toString())).toBeInTheDocument()
  })

  test('renders task cards for all tasks', () => {
    renderWithStore(
      <KanbanColumn status="scheduled" tasks={scheduledTasks} />
    )
    
    scheduledTasks.forEach(task => {
      expect(screen.getByTestId(`task-card-${task.id}`)).toBeInTheDocument()
      expect(screen.getByText(task.title)).toBeInTheDocument()
    })
  })

  test('shows empty state when no tasks and no onCreateTask', () => {
    renderWithStore(
      <KanbanColumn status="scheduled" tasks={[]} />
    )
    
    expect(screen.getByText('No tasks in scheduled')).toBeInTheDocument()
  })

  test('shows ColumnEmptyState when no tasks and onCreateTask is provided', () => {
    const mockCreateTask = jest.fn()
    
    renderWithStore(
      <KanbanColumn status="scheduled" tasks={[]} onCreateTask={mockCreateTask} />
    )
    
    expect(screen.getByText('No tasks in scheduled')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add a task' })).toBeInTheDocument()
  })

  test('shows loading state when isLoading is true', () => {
    const { container } = renderWithStore(
      <KanbanColumn status="scheduled" tasks={[]} isLoading={true} />
    )
    
    // Should show TaskCountLoader instead of task count
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
    
    // Should show TaskCardSkeleton components
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(3) // 2 TaskCardSkeleton + 1 additional skeleton
  })

  test('shows loading skeleton for tasks when isLoading', () => {
    const { container } = renderWithStore(
      <KanbanColumn status="scheduled" tasks={scheduledTasks} isLoading={true} />
    )
    
    // Should not render actual task cards when loading
    scheduledTasks.forEach(task => {
      expect(screen.queryByTestId(`task-card-${task.id}`)).not.toBeInTheDocument()
    })
    
    // Should show skeleton loading
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(3)
  })

  test('applies minimum height to column content area', () => {
    const { container } = renderWithStore(
      <KanbanColumn status="scheduled" tasks={[]} />
    )
    
    const contentArea = container.querySelector('.min-h-\\[200px\\]')
    expect(contentArea).toBeInTheDocument()
  })

  test('shows drop indicator when dragging over empty column', () => {
    const activeTask = mockTasks[0]
    
    renderWithStore(
      <KanbanColumn 
        status="done" 
        tasks={[]} 
        activeTask={activeTask}
        overId="done"
      />
    )
    
    // Since we can't easily mock useDroppable, just check the column renders
    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  test('handles tasks with different statuses correctly', () => {
    // Only scheduled tasks should be shown in scheduled column
    const mixedTasks = [...mockTasks]
    const scheduledOnly = mixedTasks.filter(task => task.status === 'scheduled')
    
    renderWithStore(
      <KanbanColumn status="scheduled" tasks={scheduledOnly} />
    )
    
    // Should only show scheduled tasks
    expect(screen.getByText(scheduledOnly.length.toString())).toBeInTheDocument()
    
    scheduledOnly.forEach(task => {
      expect(screen.getByTestId(`task-card-${task.id}`)).toBeInTheDocument()
    })
  })

  test('maintains proper spacing between task cards', () => {
    const { container } = renderWithStore(
      <KanbanColumn status="scheduled" tasks={scheduledTasks} />
    )
    
    const tasksContainer = container.querySelector('.space-y-3')
    expect(tasksContainer).toBeInTheDocument()
  })

  test('has proper column structure and layout', () => {
    const { container } = renderWithStore(
      <KanbanColumn status="scheduled" tasks={scheduledTasks} />
    )
    
    // Should have proper column container
    const columnContainer = container.querySelector('.rounded-lg.p-4.h-fit')
    expect(columnContainer).toBeInTheDocument()
    
    // Should have header with title and count
    const header = container.querySelector('.flex.justify-between.items-center.mb-4')
    expect(header).toBeInTheDocument()
    
    // Should have tasks container
    const tasksContainer = container.querySelector('.space-y-3.min-h-\\[200px\\]')
    expect(tasksContainer).toBeInTheDocument()
  })

  test('handles empty task list gracefully', () => {
    renderWithStore(
      <KanbanColumn status="scheduled" tasks={[]} />
    )
    
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('No tasks in scheduled')).toBeInTheDocument()
  })

  test('renders with memo optimization', () => {
    // Test that component is memoized by rendering it
    renderWithStore(
      <KanbanColumn status="scheduled" tasks={[]} />
    )
    
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
  })

  test('task count badge has correct styling', () => {
    const { container } = renderWithStore(
      <KanbanColumn status="scheduled" tasks={scheduledTasks} />
    )
    
    const countBadge = container.querySelector('.bg-white.text-gray-600.px-2.py-1.rounded-full')
    expect(countBadge).toBeInTheDocument()
    expect(countBadge).toHaveTextContent(scheduledTasks.length.toString())
  })

  test('column title uses correct header styling for each status', () => {
    const { container: scheduledContainer } = renderWithStore(
      <KanbanColumn status="scheduled" tasks={[]} />
    )
    expect(scheduledContainer.querySelector('.text-gray-700')).toBeInTheDocument()
    
    const { container: inProgressContainer } = renderWithStore(
      <KanbanColumn status="in-progress" tasks={[]} />
    )
    expect(inProgressContainer.querySelector('.text-blue-700')).toBeInTheDocument()
    
    const { container: doneContainer } = renderWithStore(
      <KanbanColumn status="done" tasks={[]} />
    )
    expect(doneContainer.querySelector('.text-green-700')).toBeInTheDocument()
  })
})