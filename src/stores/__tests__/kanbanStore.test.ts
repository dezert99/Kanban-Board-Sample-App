import { useKanbanStore } from '@/stores/kanbanStore'
import { Task } from '@/types'

// Mock localStorage for Zustand persistence
const localStorageMock = {
  getItem: jest.fn(() => null), // Return null to prevent loading persisted data
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

describe('Kanban Store', () => {
  beforeEach(() => {
    // Clear localStorage mock calls
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    
    // Reset store state completely by calling setState directly
    useKanbanStore.setState({
      tasks: [],
      filters: {
        search: '',
        assignee: null,
        tags: [],
      }
    })
  })

  test('should add a new task', () => {
    const store = useKanbanStore.getState()
    const initialCount = store.tasks.length

    const newTask: Task = {
      id: 'TSK-TEST',
      title: 'Test Task',
      description: 'Test Description',
      status: 'scheduled',
      assignee: 'Test User',
      tags: ['test'],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: 0,
    }

    store.addTask(newTask)

    // Get fresh state after the action
    const updatedStore = useKanbanStore.getState()
    expect(updatedStore.tasks).toHaveLength(initialCount + 1)
    expect(updatedStore.tasks.find(task => task.id === 'TSK-TEST')).toEqual(newTask)
  })

  test('should update an existing task', () => {
    const store = useKanbanStore.getState()
    
    // First add a task to update
    const testTask: Task = {
      id: 'TSK-UPDATE',
      title: 'Original Title',
      description: 'Test Description',
      status: 'scheduled',
      assignee: 'Test User',
      tags: ['test'],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: 0,
    }
    store.addTask(testTask)

    store.updateTask(testTask.id, { title: 'Updated Title' })

    // Get fresh state after the action
    const updatedStore = useKanbanStore.getState()
    const updatedTask = updatedStore.tasks.find(task => task.id === testTask.id)
    expect(updatedTask?.title).toBe('Updated Title')
    expect(updatedTask?.updatedAt).toBeInstanceOf(Date)
  })

  test('should delete a task', () => {
    const store = useKanbanStore.getState()
    
    // First add a task to delete
    const testTask: Task = {
      id: 'TSK-DELETE',
      title: 'Task to Delete',
      description: 'Test Description',
      status: 'scheduled',
      assignee: 'Test User',
      tags: ['test'],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: 0,
    }
    store.addTask(testTask)
    const storeAfterAdd = useKanbanStore.getState()
    const countAfterAdd = storeAfterAdd.tasks.length

    store.deleteTask(testTask.id)

    // Get fresh state after the action
    const updatedStore = useKanbanStore.getState()
    expect(updatedStore.tasks).toHaveLength(countAfterAdd - 1)
    expect(updatedStore.tasks.find(task => task.id === testTask.id)).toBeUndefined()
  })

  test('should move task to different column', () => {
    const store = useKanbanStore.getState()
    
    // First add a task to move
    const testTask: Task = {
      id: 'TSK-MOVE',
      title: 'Task to Move',
      description: 'Test Description',
      status: 'scheduled',
      assignee: 'Test User',
      tags: ['test'],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: 0,
    }
    store.addTask(testTask)

    store.moveTask(testTask.id, 'in-progress')

    // Get fresh state after the action
    const updatedStore = useKanbanStore.getState()
    const movedTask = updatedStore.tasks.find(task => task.id === testTask.id)
    expect(movedTask?.status).toBe('in-progress')
    expect(movedTask?.updatedAt).toBeInstanceOf(Date)
  })

  test('should filter tasks by search term', () => {
    const store = useKanbanStore.getState()
    
    // Add test tasks
    const task1: Task = {
      id: 'TSK-SEARCH-1',
      title: 'Test Task One',
      description: 'Description here',
      status: 'scheduled',
      assignee: 'Test User',
      tags: ['test'],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: 0,
    }
    const task2: Task = {
      id: 'TSK-SEARCH-2',
      title: 'Different Title',
      description: 'Task description here',
      status: 'scheduled',
      assignee: 'Test User',
      tags: ['test'],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: 1,
    }
    store.addTask(task1)
    store.addTask(task2)
    
    store.setFilter({ search: 'task' })
    const filteredTasks = store.getFilteredTasks()

    expect(filteredTasks).toHaveLength(2) // Both tasks contain "task"
    
    // All filtered tasks should match the search term
    filteredTasks.forEach(task => {
      const matchesSearch = 
        task.title.toLowerCase().includes('task') ||
        task.description.toLowerCase().includes('task')
      expect(matchesSearch).toBe(true)
    })
  })

  test('should filter tasks by assignee', () => {
    const store = useKanbanStore.getState()
    
    // Add test tasks with different assignees
    const task1: Task = {
      id: 'TSK-ASSIGN-1',
      title: 'Task One',
      description: 'Description',
      status: 'scheduled',
      assignee: 'John Doe',
      tags: ['test'],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: 0,
    }
    const task2: Task = {
      id: 'TSK-ASSIGN-2',
      title: 'Task Two',
      description: 'Description',
      status: 'scheduled',
      assignee: 'Jane Smith',
      tags: ['test'],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: 1,
    }
    store.addTask(task1)
    store.addTask(task2)

    store.setFilter({ assignee: 'John Doe' })
    const filteredTasks = store.getFilteredTasks()

    expect(filteredTasks).toHaveLength(1)
    expect(filteredTasks[0].assignee).toBe('John Doe')
  })

  test('should filter tasks by tags', () => {
    const store = useKanbanStore.getState()
    
    // Add test tasks with different tags
    const task1: Task = {
      id: 'TSK-TAG-1',
      title: 'Task One',
      description: 'Description',
      status: 'scheduled',
      assignee: 'Test User',
      tags: ['frontend', 'urgent'],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: 0,
    }
    const task2: Task = {
      id: 'TSK-TAG-2',
      title: 'Task Two',
      description: 'Description',
      status: 'scheduled',
      assignee: 'Test User',
      tags: ['backend', 'urgent'],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: 1,
    }
    store.addTask(task1)
    store.addTask(task2)

    store.setFilter({ tags: ['frontend'] })
    const filteredTasks = store.getFilteredTasks()

    expect(filteredTasks).toHaveLength(1)
    expect(filteredTasks[0].tags).toContain('frontend')
  })

  test('should clear all filters', () => {
    const store = useKanbanStore.getState()

    // Set some filters
    store.setFilter({
      search: 'test',
      assignee: 'John Doe',
      tags: ['backend']
    })

    // Get fresh state and verify filters are set
    const storeWithFilters = useKanbanStore.getState()
    expect(storeWithFilters.filters.search).toBe('test')
    expect(storeWithFilters.filters.assignee).toBe('John Doe')
    expect(storeWithFilters.filters.tags).toContain('backend')

    // Clear filters
    store.clearFilters()

    // Get fresh state and verify filters are cleared
    const clearedStore = useKanbanStore.getState()
    expect(clearedStore.filters.search).toBe('')
    expect(clearedStore.filters.assignee).toBeNull()
    expect(clearedStore.filters.tags).toHaveLength(0)
  })

  test('should get tasks by status', () => {
    const store = useKanbanStore.getState()

    // Add test tasks with different statuses
    const scheduledTask: Task = {
      id: 'TSK-SCHED',
      title: 'Scheduled Task',
      description: 'Description',
      status: 'scheduled',
      assignee: 'Test User',
      tags: ['test'],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: 0,
    }
    const inProgressTask: Task = {
      id: 'TSK-PROG',
      title: 'In Progress Task',
      description: 'Description',
      status: 'in-progress',
      assignee: 'Test User',
      tags: ['test'],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: 0,
    }
    const doneTask: Task = {
      id: 'TSK-DONE',
      title: 'Done Task',
      description: 'Description',
      status: 'done',
      assignee: 'Test User',
      tags: ['test'],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: 0,
    }
    
    store.addTask(scheduledTask)
    store.addTask(inProgressTask)
    store.addTask(doneTask)

    const scheduledTasks = store.getTasksByStatus('scheduled')
    const inProgressTasks = store.getTasksByStatus('in-progress')
    const doneTasks = store.getTasksByStatus('done')

    // Check we get the right tasks
    expect(scheduledTasks).toHaveLength(1)
    expect(inProgressTasks).toHaveLength(1)
    expect(doneTasks).toHaveLength(1)

    // All tasks should have the correct status
    expect(scheduledTasks[0].status).toBe('scheduled')
    expect(inProgressTasks[0].status).toBe('in-progress')
    expect(doneTasks[0].status).toBe('done')
  })

  test('should combine multiple filters', () => {
    const store = useKanbanStore.getState()

    // Add test tasks
    const matchingTask: Task = {
      id: 'TSK-MATCH',
      title: 'Test Task Match',
      description: 'Description',
      status: 'scheduled',
      assignee: 'John Doe',
      tags: ['frontend', 'test'],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: 0,
    }
    const nonMatchingTask: Task = {
      id: 'TSK-NO-MATCH',
      title: 'Different Title',
      description: 'Description',
      status: 'scheduled',
      assignee: 'Jane Smith',
      tags: ['backend'],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: 1,
    }
    
    store.addTask(matchingTask)
    store.addTask(nonMatchingTask)

    // Set multiple filters
    store.setFilter({
      search: 'task',
      assignee: 'John Doe',
      tags: ['frontend']
    })

    const filteredTasks = store.getFilteredTasks()

    // Should only get the matching task
    expect(filteredTasks).toHaveLength(1)
    expect(filteredTasks[0].id).toBe('TSK-MATCH')
    
    // Verify it matches all criteria
    const task = filteredTasks[0]
    const matchesSearch = 
      task.title.toLowerCase().includes('task') ||
      task.description.toLowerCase().includes('task')
    
    expect(matchesSearch).toBe(true)
    expect(task.assignee).toBe('John Doe')
    expect(task.tags).toContain('frontend')
  })
})