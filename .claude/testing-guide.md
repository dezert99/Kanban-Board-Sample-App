# Testing Guide - Kanban Board

## 🎯 Testing Philosophy

The requirement states: **"User-level tests covering core logic"**

This means:
- **User-level**: Test from the user's perspective, not implementation details
- **Core logic**: Focus on the main functionality users actually use
- **Behavioral testing**: Test what the app does, not how it does it

## 🏗️ Test Architecture

```
__tests__/
├── integration/          # User workflow tests
│   ├── KanbanBoard.test.tsx
│   ├── DragAndDrop.test.tsx
│   ├── TaskCRUD.test.tsx
│   ├── Filtering.test.tsx
│   ├── PersistenceFlow.test.tsx
│   └── MobileInteractions.test.tsx
├── setup/               # Test configuration
│   └── testUtils.tsx
└── fixtures/           # Test data
    └── mockTasks.ts
```

## 📋 What to Test (Priority Order)

### 1. Critical User Paths (MUST HAVE)
These are the core features that MUST work:

```typescript
// The user can...
- View tasks organized in three columns
- Drag a task from one column to another
- Create a new task
- Edit an existing task
- Delete a task
- Filter tasks by search term
- Filter tasks by assignee
- Click a task to view details
```

### 2. Data Persistence (IMPORTANT)
```typescript
// After page reload...
- Tasks remain in their moved positions
- Filters are maintained
- New tasks are still present
```

### 3. Combined Interactions (NICE TO HAVE)
```typescript
// Complex workflows...
- Apply multiple filters simultaneously
- Drag task while filters are active
- Edit task and see updates in board
```

## 🧪 Test Implementation Examples

### Testing a Complete User Journey
```typescript
describe('User completes a task workflow', () => {
  test('User can create, move, and complete a task', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Step 1: Create a new task
    await user.click(screen.getByText('New Task'))
    await user.type(screen.getByLabelText('Title'), 'Fix homepage bug')
    await user.type(screen.getByLabelText('Description'), 'Navigation menu broken on mobile')
    await user.selectOptions(screen.getByLabelText('Assignee'), 'John Doe')
    await user.click(screen.getByText('Create'))
    
    // Step 2: Verify task appears in Scheduled column
    const scheduledColumn = screen.getByTestId('column-scheduled')
    expect(within(scheduledColumn).getByText('Fix homepage bug')).toBeInTheDocument()
    
    // Step 3: Drag task to In Progress
    const task = screen.getByText('Fix homepage bug').closest('[data-testid^="task-"]')
    const inProgressColumn = screen.getByTestId('column-in-progress')
    
    fireEvent.dragStart(task!)
    fireEvent.drop(inProgressColumn)
    
    // Step 4: Verify task moved
    expect(within(inProgressColumn).getByText('Fix homepage bug')).toBeInTheDocument()
    expect(within(scheduledColumn).queryByText('Fix homepage bug')).not.toBeInTheDocument()
    
    // Step 5: Click to view details
    await user.click(screen.getByText('Fix homepage bug'))
    
    // Step 6: Verify navigation to detail page
    expect(screen.getByText('Task Details')).toBeInTheDocument()
    expect(screen.getByText('Navigation menu broken on mobile')).toBeInTheDocument()
  })
})
```

### Testing Filter Combinations
```typescript
describe('Filter functionality', () => {
  test('User can combine text search with assignee filter', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)
    
    // Initial state: all tasks visible
    expect(screen.getAllByTestId(/task-/)).toHaveLength(15)
    
    // Apply text filter
    const searchInput = screen.getByPlaceholderText('Search tasks...')
    await user.type(searchInput, 'bug')
    
    // Should show only tasks with "bug" in title/description
    await waitFor(() => {
      const visibleTasks = screen.getAllByTestId(/task-/)
      expect(visibleTasks.length).toBeLessThan(15)
      visibleTasks.forEach(task => {
        expect(task.textContent?.toLowerCase()).toContain('bug')
      })
    })
    
    // Add assignee filter
    const assigneeSelect = screen.getByLabelText('Filter by assignee')
    await user.selectOptions(assigneeSelect, 'John Doe')
    
    // Should show only John's tasks with "bug"
    await waitFor(() => {
      const visibleTasks = screen.getAllByTestId(/task-/)
      visibleTasks.forEach(task => {
        expect(task.textContent).toContain('John Doe')
        expect(task.textContent?.toLowerCase()).toContain('bug')
      })
    })
    
    // Clear filters
    await user.click(screen.getByText('Clear filters'))
    
    // Should show all tasks again
    expect(screen.getAllByTestId(/task-/)).toHaveLength(15)
  })
})
```

### Testing Drag and Drop Edge Cases
```typescript
describe('Drag and drop edge cases', () => {
  test('Dragging to same column does nothing', () => {
    render(<KanbanBoard />)
    
    const scheduledColumn = screen.getByTestId('column-scheduled')
    const task = within(scheduledColumn).getAllByTestId(/task-/)[0]
    const initialTaskCount = within(scheduledColumn).getAllByTestId(/task-/).length
    
    // Drag within same column
    fireEvent.dragStart(task)
    fireEvent.drop(scheduledColumn)
    
    // Task count should remain the same
    expect(within(scheduledColumn).getAllByTestId(/task-/)).toHaveLength(initialTaskCount)
  })
  
  test('Invalid drop zones are ignored', () => {
    render(<KanbanBoard />)
    
    const task = screen.getAllByTestId(/task-/)[0]
    const header = screen.getByRole('banner')
    
    // Try to drop on header (invalid zone)
    fireEvent.dragStart(task)
    fireEvent.drop(header)
    
    // Task should remain in original position
    const scheduledColumn = screen.getByTestId('column-scheduled')
    expect(within(scheduledColumn).getAllByTestId(/task-/)[0]).toBe(task)
  })
})
```

### Testing Data Persistence
```typescript
describe('LocalStorage persistence', () => {
  test('Tasks persist after page reload', async () => {
    const { unmount } = render(<App />)
    const user = userEvent.setup()
    
    // Create a task
    await user.click(screen.getByText('New Task'))
    await user.type(screen.getByLabelText('Title'), 'Persistent Task')
    await user.click(screen.getByText('Create'))
    
    // Verify task exists
    expect(screen.getByText('Persistent Task')).toBeInTheDocument()
    
    // Simulate page reload
    unmount()
    
    // Re-render app
    render(<App />)
    
    // Task should still exist
    expect(screen.getByText('Persistent Task')).toBeInTheDocument()
  })
  
  test('Filter state persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Apply filters
    await user.type(screen.getByPlaceholderText('Search tasks...'), 'test')
    await user.selectOptions(screen.getByLabelText('Filter by assignee'), 'John Doe')
    
    // Navigate to task detail
    await user.click(screen.getAllByTestId(/task-/)[0])
    
    // Navigate back
    await user.click(screen.getByText('Back to Board'))
    
    // Filters should still be applied
    expect(screen.getByPlaceholderText('Search tasks...')).toHaveValue('test')
    expect(screen.getByLabelText('Filter by assignee')).toHaveValue('John Doe')
  })
})
```

## 🔧 Test Setup

### 1. Install Dependencies
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

### 2. Configure Jest (jest.config.js)
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

### 3. Setup File (jest.setup.js)
```javascript
import '@testing-library/jest-dom'

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Mock matchMedia
window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
```

## 📊 Coverage Goals

Aim for **70-80% coverage** on these critical areas:

| Feature | Target Coverage | Priority |
|---------|----------------|----------|
| Task CRUD | 90% | CRITICAL |
| Drag & Drop | 80% | CRITICAL |
| Filtering | 85% | HIGH |
| Persistence | 75% | HIGH |
| Navigation | 70% | MEDIUM |
| Mobile | 60% | MEDIUM |

## ✅ Testing Checklist

Before submitting, ensure tests cover:

- [ ] **Task Creation**: User can create a task with all fields
- [ ] **Task Editing**: User can modify existing tasks
- [ ] **Task Deletion**: User can remove tasks
- [ ] **Drag and Drop**: Tasks move between all three columns
- [ ] **Search Filter**: Text search works on title and description
- [ ] **Assignee Filter**: Can filter by specific assignee
- [ ] **Tag Filter**: Can filter by one or more tags
- [ ] **Combined Filters**: Multiple filters work together
- [ ] **Clear Filters**: Reset button works
- [ ] **Task Navigation**: Clicking task goes to detail page
- [ ] **Data Persistence**: Changes survive page reload
- [ ] **Mobile View**: Column switching works on mobile
- [ ] **Empty States**: Proper messages when no tasks/results
- [ ] **Error States**: Graceful handling of errors

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode during development
npm run test:watch

# Run specific test file
npm test KanbanBoard.test.tsx

# Run with verbose output
npm test -- --verbose
```

## 💡 Testing Best Practices

### DO ✅
- Test user behavior, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Test happy paths and edge cases
- Keep tests focused and isolated
- Use descriptive test names
- Mock external dependencies

### DON'T ❌
- Test implementation details
- Test third-party libraries
- Use arbitrary waits (use waitFor instead)
- Test styles or CSS classes
- Make tests dependent on each other
- Forget to clean up after tests

## 📈 Example Test Report

After running `npm run test:coverage`, you should see:

```
PASS  __tests__/integration/KanbanBoard.test.tsx
PASS  __tests__/integration/DragAndDrop.test.tsx
PASS  __tests__/integration/TaskCRUD.test.tsx
PASS  __tests__/integration/Filtering.test.tsx

Test Suites: 6 passed, 6 total
Tests:       42 passed, 42 total
Coverage:
  Statements   : 76.23% ( 412/540 )
  Branches     : 71.45% ( 89/124 )
  Functions    : 78.92% ( 67/85 )
  Lines        : 75.84% ( 398/524 )
```

This demonstrates comprehensive testing that validates the application works correctly from the user's perspective!