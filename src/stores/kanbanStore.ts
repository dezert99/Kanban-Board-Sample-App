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
        return filteredTasks.filter((task) => task.status === status);
      },
    }),
    {
      name: 'kanban-storage',
      // Only persist tasks and filters, not computed functions
      partialize: (state) => ({
        tasks: state.tasks,
        filters: state.filters,
      }),
    }
  )
);