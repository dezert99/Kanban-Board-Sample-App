import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus, FilterState } from '@/types';
import { mockTasks } from '@/data/mockData';

interface KanbanStore {
  tasks: Task[];
  filters: FilterState;
  
  // Task actions
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  reorderTasksInColumn: (status: TaskStatus, oldIndex: number, newIndex: number) => void;
  moveTaskToColumn: (taskId: string, newStatus: TaskStatus, targetIndex: number) => void;
  
  // Filter actions
  setFilter: (filter: Partial<FilterState>) => void;
  clearFilters: () => void;
  
  // Computed values
  getFilteredTasks: () => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
}

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      tasks: mockTasks,
      filters: {
        search: '',
        assignee: null,
        tags: [],
      },
      
      // Task actions
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),
      
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        })),
      
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      
      moveTask: (taskId, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, status: newStatus, updatedAt: new Date() }
              : task
          ),
        })),
      
      reorderTasksInColumn: (status, oldIndex, newIndex) =>
        set((state) => {
          // Get filtered tasks for this column (same as what the UI sees)
          const filteredColumnTasks = get().getTasksByStatus(status);
          
          // Get the actual task that was moved
          const movedTask = filteredColumnTasks[oldIndex];
          if (!movedTask) return state;
          
          // Get all tasks for this status (including filtered out ones)
          const allColumnTasks = state.tasks
            .filter((task) => task.status === status)
            .sort((a, b) => a.sortOrder - b.sortOrder);
          
          // Create a new order array with the moved task in its new position
          const reorderedFilteredTasks = [...filteredColumnTasks];
          reorderedFilteredTasks.splice(oldIndex, 1);
          reorderedFilteredTasks.splice(newIndex, 0, movedTask);
          
          // Update sortOrder for all tasks in this column based on new filtered order
          const updatedTasks = state.tasks.map((task) => {
            if (task.status !== status) return task;
            
            const indexInFiltered = reorderedFilteredTasks.findIndex(t => t.id === task.id);
            if (indexInFiltered !== -1) {
              // Task is visible - use its position in the filtered list
              return {
                ...task,
                sortOrder: indexInFiltered,
                updatedAt: new Date(),
              };
            } else {
              // Task is filtered out - keep its existing sortOrder but shift if needed
              const originalIndex = allColumnTasks.findIndex(t => t.id === task.id);
              return {
                ...task,
                sortOrder: originalIndex >= newIndex ? originalIndex + 1 : originalIndex,
                updatedAt: new Date(),
              };
            }
          });
          
          return {
            tasks: updatedTasks,
          };
        }),
      
      moveTaskToColumn: (taskId, newStatus, targetIndex) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;
          
          // Get filtered tasks for target column (same as what the UI sees)
          const filteredTargetTasks = get().getTasksByStatus(newStatus);
          
          // Insert the moved task at the target position in the filtered list
          const newFilteredOrder = [...filteredTargetTasks];
          newFilteredOrder.splice(targetIndex, 0, {
            ...task,
            status: newStatus,
            updatedAt: new Date(),
          });
          
          // Update all tasks
          const updatedTasks = state.tasks.map((t) => {
            if (t.id === taskId) {
              // Update the moved task
              return {
                ...t,
                status: newStatus,
                sortOrder: targetIndex,
                updatedAt: new Date(),
              };
            } else if (t.status === newStatus) {
              // Update other tasks in the target column
              const indexInFiltered = newFilteredOrder.findIndex(ft => ft.id === t.id);
              if (indexInFiltered !== -1) {
                return {
                  ...t,
                  sortOrder: indexInFiltered,
                  updatedAt: new Date(),
                };
              }
            }
            return t;
          });
          
          return {
            tasks: updatedTasks,
          };
        }),
      
      // Filter actions
      setFilter: (filter) =>
        set((state) => ({
          filters: { ...state.filters, ...filter },
        })),
      
      clearFilters: () =>
        set({
          filters: {
            search: '',
            assignee: null,
            tags: [],
          },
        }),
      
      // Computed values
      getFilteredTasks: () => {
        const { tasks, filters } = get();
        
        return tasks.filter((task) => {
          // Text search
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
              task.title.toLowerCase().includes(searchLower) ||
              task.description.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
          }
          
          // Assignee filter
          if (filters.assignee && task.assignee !== filters.assignee) {
            return false;
          }
          
          // Tag filter (task must have at least one matching tag)
          if (filters.tags.length > 0) {
            const hasMatchingTag = filters.tags.some((tag) =>
              task.tags.includes(tag)
            );
            if (!hasMatchingTag) return false;
          }
          
          return true;
        });
      },
      
      getTasksByStatus: (status) => {
        const filteredTasks = get().getFilteredTasks();
        return filteredTasks
          .filter((task) => task.status === status)
          .sort((a, b) => a.sortOrder - b.sortOrder);
      },
    }),
    {
      name: 'kanban-storage',
      // Only persist tasks and filters, not computed functions
      partialize: (state) => ({
        tasks: state.tasks,
        filters: state.filters,
      }),
      // Custom merge function to prioritize persisted data over mock data
      // This is necessary during development to prevent flash of mock data before localStorage loads
      merge: (persistedState, currentState) => {
        const persisted = persistedState as { tasks?: Task[]; filters?: FilterState } | null;
        return {
          ...currentState,
          // Restore persisted tasks or use mock data if empty
          tasks: (persisted?.tasks && persisted.tasks.length > 0) ? persisted.tasks : mockTasks,
          // Restore persisted filters or use default empty filters
          filters: persisted?.filters || currentState.filters,
        };
      },
    }
  )
);