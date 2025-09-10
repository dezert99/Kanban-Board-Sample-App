import { render } from '@/test-utils'
import { 
  LoadingSkeleton,
  TaskCardSkeleton,
  KanbanColumnSkeleton,
  KanbanBoardSkeleton,
  KanbanColumnLoadingState,
  TaskCountLoader,
  FilterBarSkeleton,
  TaskDetailSkeleton,
  TableRowSkeleton,
  BacklogTableSkeleton
} from '../LoadingSkeleton'

describe('LoadingSkeleton', () => {
  test('renders basic loading skeleton', () => {
    render(<LoadingSkeleton />)
    
    const skeletonContainer = document.querySelector('.animate-pulse')
    expect(skeletonContainer).toBeInTheDocument()
    
    const skeletonDivs = document.querySelectorAll('.bg-gray-200')
    expect(skeletonDivs.length).toBeGreaterThan(0)
  })
})

describe('TaskCardSkeleton', () => {
  test('renders task card skeleton structure', () => {
    render(<TaskCardSkeleton />)
    
    const cardSkeleton = document.querySelector('.animate-pulse.bg-white')
    expect(cardSkeleton).toBeInTheDocument()
    expect(cardSkeleton).toHaveClass('rounded-lg', 'shadow-sm', 'border-l-4')
  })
})

describe('KanbanColumnSkeleton', () => {
  test('renders column skeleton with default props', () => {
    render(<KanbanColumnSkeleton />)
    
    const columnSkeleton = document.querySelector('.bg-gray-100')
    expect(columnSkeleton).toBeInTheDocument()
    expect(columnSkeleton).toHaveClass('rounded-lg', 'p-4')
  })

  test('renders column skeleton with custom props', () => {
    render(
      <KanbanColumnSkeleton 
        title="Test Column" 
        bgColor="bg-blue-100" 
        headerColor="text-blue-700"
      />
    )
    
    const columnSkeleton = document.querySelector('.bg-blue-100')
    expect(columnSkeleton).toBeInTheDocument()
    
    const titleElement = document.querySelector('.text-blue-700')
    expect(titleElement).toBeInTheDocument()
    expect(titleElement).toHaveTextContent('Test Column')
  })
})

describe('KanbanBoardSkeleton', () => {
  test('renders full board skeleton with three columns', () => {
    render(<KanbanBoardSkeleton />)
    
    const boardContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3')
    expect(boardContainer).toBeInTheDocument()
    
    // Should have titles for all three columns
    expect(document.querySelector('h2[class*="text-gray-700"]')).toHaveTextContent('Scheduled')
    expect(document.querySelector('h2[class*="text-blue-700"]')).toHaveTextContent('In Progress')
    expect(document.querySelector('h2[class*="text-green-700"]')).toHaveTextContent('Done')
  })
})

describe('KanbanColumnLoadingState', () => {
  test('renders loading column with spinner', () => {
    render(
      <KanbanColumnLoadingState 
        title="Loading Column" 
        bgColor="bg-blue-50" 
        headerColor="text-blue-700"
      />
    )
    
    const loadingColumn = document.querySelector('.bg-blue-50')
    expect(loadingColumn).toBeInTheDocument()
    
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('border-t-blue-600')
    
    expect(document.querySelector('.text-blue-700')).toHaveTextContent('Loading Column')
  })
})

describe('TaskCountLoader', () => {
  test('renders compact spinner for task count', () => {
    render(<TaskCountLoader />)
    
    const countLoader = document.querySelector('.bg-white.px-2.py-1.rounded-full')
    expect(countLoader).toBeInTheDocument()
    
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('w-3', 'h-3', 'border-t-blue-600')
  })
})

describe('FilterBarSkeleton', () => {
  test('renders filter bar skeleton structure', () => {
    render(<FilterBarSkeleton />)
    
    const filterBarSkeleton = document.querySelector('.bg-white.rounded-lg.shadow-sm.p-4.mb-6.animate-pulse')
    expect(filterBarSkeleton).toBeInTheDocument()
    
    // Should have search input placeholder
    const searchPlaceholder = document.querySelector('.flex-1 .h-10.bg-gray-200')
    expect(searchPlaceholder).toBeInTheDocument()
    
    // Should have filter button placeholders
    const filterPlaceholders = document.querySelectorAll('.h-10.bg-gray-200')
    expect(filterPlaceholders.length).toBeGreaterThan(3) // Search + 3 filter buttons
  })
})

describe('TaskDetailSkeleton', () => {
  test('renders task detail skeleton with all sections', () => {
    render(<TaskDetailSkeleton />)
    
    const detailSkeleton = document.querySelector('.bg-white.rounded-lg.shadow-lg.p-6')
    expect(detailSkeleton).toBeInTheDocument()
    
    // Should have Back to Board button
    expect(document.querySelector('button')).toHaveTextContent('Back to Board')
    
    // Should have grid layout for main content and sidebar
    const gridLayout = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3')
    expect(gridLayout).toBeInTheDocument()
    
    // Should have Details section in sidebar
    expect(document.querySelector('h3')).toHaveTextContent('Details')
  })
})

describe('TableRowSkeleton', () => {
  test('renders table row skeleton structure', () => {
    render(
      <table>
        <tbody>
          <TableRowSkeleton />
        </tbody>
      </table>
    )
    
    const tableSkeleton = document.querySelector('tr.animate-pulse')
    expect(tableSkeleton).toBeInTheDocument()
    
    // Should have multiple td elements
    const tableCells = document.querySelectorAll('td')
    expect(tableCells.length).toBe(7) // Task, Status, Assignee, Priority, Due Date, Tags, Actions
  })
})

describe('BacklogTableSkeleton', () => {
  test('renders full backlog table skeleton', () => {
    render(<BacklogTableSkeleton />)
    
    const tableSkeleton = document.querySelector('.bg-white.rounded-lg.shadow-sm.overflow-hidden')
    expect(tableSkeleton).toBeInTheDocument()
    
    // Should have table headers
    const headers = document.querySelectorAll('th')
    expect(headers.length).toBe(7)
    expect(headers[0]).toHaveTextContent('Task')
    expect(headers[1]).toHaveTextContent('Status')
    expect(headers[2]).toHaveTextContent('Assignee')
    expect(headers[3]).toHaveTextContent('Priority')
    expect(headers[4]).toHaveTextContent('Due Date')
    expect(headers[5]).toHaveTextContent('Tags')
    
    // Should have 8 skeleton rows
    const skeletonRows = document.querySelectorAll('tr.animate-pulse')
    expect(skeletonRows).toHaveLength(8)
  })
})