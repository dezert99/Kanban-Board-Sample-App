# Implementation Tasks - Kanban Board

## 📋 Task Overview

Priority: Core features first, then enhancements

## 🎯 Implementation Order

### Phase 1: Foundation ✅ COMPLETED
- [x] Task 1: Project Setup
- [x] Task 2: Data Layer & Mock Data
- [x] Task 3: Basic Type Definitions

### Phase 2: Core Features ✅ COMPLETED
- [x] Task 4: Kanban Board Layout
- [x] Task 5: Drag and Drop (Enhanced with precise positioning)
- [x] Task 6: Task Card Component
- [x] Task 7: Filter System (Works with drag & drop)

### Phase 3: Routes & Views ✅ COMPLETED
- [x] Task 8: Task Detail Page
- [x] Task 9: Backlog/List View
- [x] Task 10: Create/Edit Modal

### Phase 4: Polish ✅ COMPLETED
- [x] Task 11: Mobile Responsive Design
- [x] Task 12: Loading & Empty States (with skeleton UI)
- [x] Task 13: Enhanced Column Loading States
- [x] Task 14: Task Detail Page Loading Skeleton
- [x] Task 15: Filter State Persistence
- [x] Task 16: Documentation Updates

### Phase 5: Stretch Goals
- [ ] Task 14: Advanced Features
- [ ] Task 15: Testing

---

## Task 1: Project Setup and Configuration

**Status**: ✅ COMPLETED  
**Priority**: CRITICAL  
**Dependencies**: None

### Description
Initialize Next.js 14 project with TypeScript, Tailwind CSS, and essential dependencies.

### Implementation Steps
```bash
# 1. Create Next.js app
npx create-next-app@latest kanban-board --typescript --tailwind --app --src-dir

# 2. Install dependencies
cd kanban-board
npm install zustand @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities date-fns lucide-react

# 3. Install dev dependencies
npm install -D @types/node
```

### File Structure to Create
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
├── stores/
├── hooks/
├── lib/
├── types/
└── data/
```

### Configuration Files

**tsconfig.json** - Add path aliases:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**tailwind.config.ts** - Add custom colors:
```typescript
export default {
  theme: {
    extend: {
      colors: {
        priority: {
          low: '#10b981',
          medium: '#f59e0b',
          high: '#ef4444',
          critical: '#dc2626'
        }
      }
    }
  }
}
```

---

## Task 2: Data Layer & Mock Data

**Status**: ✅ COMPLETED  
**Priority**: CRITICAL  
**Dependencies**: Task 1

### Description
Create Zustand store with localStorage persistence and generate 15 realistic mock tasks.

### Files to Create

**src/types/index.ts**:
```typescript
export type TaskStatus = 'scheduled' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  tags: string[];
  priority?: Priority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface FilterState {
  search: string;
  assignee: string | null;
  tags: string[];
}
```

**src/stores/kanbanStore.ts**:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  
  // Computed
  getFilteredTasks: () => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
}
```

**src/data/mockData.ts**:
```typescript
export const mockTasks: Task[] = [
  {
    id: 'TSK-001',
    title: 'Implement user authentication',
    description: 'Add JWT-based auth system with login and registration endpoints',
    status: 'scheduled',
    assignee: 'John Doe',
    tags: ['backend', 'feature'],
    priority: 'high',
    dueDate: new Date('2024-12-15'),
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
  },
  // ... 14 more tasks
];
```

---

## Task 3: Kanban Board Core Components

**Status**: ✅ COMPLETED  
**Priority**: CRITICAL  
**Dependencies**: Task 2

### Description
Build the main Kanban board with three columns and basic task cards.

### Files to Create

**src/app/page.tsx**:
```typescript
import { KanbanBoard } from '@/components/board/KanbanBoard';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sprint Board</h1>
        <KanbanBoard />
      </div>
    </main>
  );
}
```

**src/components/board/KanbanBoard.tsx**:
```typescript
'use client';

import { KanbanColumn } from './KanbanColumn';
import { useKanbanStore } from '@/stores/kanbanStore';

const COLUMNS: TaskStatus[] = ['scheduled', 'in-progress', 'done'];

export function KanbanBoard() {
  const tasks = useKanbanStore(state => state.tasks);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {COLUMNS.map(status => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasks.filter(t => t.status === status)}
        />
      ))}
    </div>
  );
}
```

**src/components/board/KanbanColumn.tsx**:
```typescript
interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const columnTitle = {
    'scheduled': 'Scheduled',
    'in-progress': 'In Progress',
    'done': 'Done'
  }[status];
  
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-900">{columnTitle}</h2>
        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
```

---

## Task 4: Drag and Drop Implementation

**Status**: ✅ COMPLETED (Enhanced)  
**Priority**: CRITICAL  
**Dependencies**: Task 3

### ✅ ENHANCED IMPLEMENTATION
- Precise drop positioning with blue line indicators
- Custom collision detection using pointerWithin
- Filter-compatible drag operations
- Same-column and cross-column reordering
- No ghost cards - clean visual feedback
- Stable performance without infinite loops

### Description
Implement drag and drop functionality using @dnd-kit.

### Implementation

**Update src/components/board/KanbanBoard.tsx**:
```typescript
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

export function KanbanBoard() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const moveTask = useKanbanStore(state => state.moveTask);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const taskId = active.id as string;
    const newStatus = over.data.current?.status;
    
    if (newStatus) {
      moveTask(taskId, newStatus);
    }
    
    setActiveTask(null);
  };
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragStart={(event) => {
        const task = tasks.find(t => t.id === event.active.id);
        setActiveTask(task || null);
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columns */}
      </div>
      
      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} />}
      </DragOverlay>
    </DndContext>
  );
}
```

---

## Task 5: Task Card Component

**Status**: ✅ COMPLETED  
**Priority**: HIGH  
**Time Estimate**: 30 minutes  
**Dependencies**: Task 3

### Description
Create a rich task card component with priority indicators and smart due date chips.

### Files to Create

**src/components/board/TaskCard.tsx**:
```typescript
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DueDateChip } from '../shared/DueDateChip';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const priorityColors = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-orange-500',
    critical: 'border-l-red-500',
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white rounded-lg shadow-sm p-3 cursor-move
        border-l-4 ${priorityColors[task.priority || 'medium']}
        hover:shadow-md transition-shadow
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm">{task.title}</h3>
        <span className="text-xs text-gray-500">#{task.id}</span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-1">
          {task.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        {task.dueDate && <DueDateChip date={task.dueDate} />}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Avatar name={task.assignee} />
        <span>{task.assignee}</span>
      </div>
    </div>
  );
}
```

**src/components/shared/DueDateChip.tsx**:
```typescript
import { formatDistanceToNow, isBefore, isToday, isTomorrow } from 'date-fns';

export function DueDateChip({ date }: { date: Date }) {
  const getChipStyle = () => {
    const now = new Date();
    
    if (isBefore(date, now)) {
      return 'bg-red-100 text-red-700';
    }
    if (isToday(date) || isTomorrow(date)) {
      return 'bg-orange-100 text-orange-700';
    }
    return 'bg-blue-100 text-blue-700';
  };
  
  const getLabel = () => {
    if (isBefore(date, new Date())) return 'Overdue';
    if (isToday(date)) return 'Due Today';
    if (isTomorrow(date)) return 'Due Tomorrow';
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  return (
    <span className={`px-2 py-1 text-xs rounded font-medium ${getChipStyle()}`}>
      {getLabel()}
    </span>
  );
}
```

---

## Task 6: Filter System

**Status**: ✅ COMPLETED  
**Priority**: HIGH  
**Time Estimate**: 30 minutes  
**Dependencies**: Task 3

### Description
Implement filtering by text search, assignee, and tags.

### Files to Create

**src/components/shared/FilterBar.tsx**:
```typescript
'use client';

import { useKanbanStore } from '@/stores/kanbanStore';
import { Search, X } from 'lucide-react';

export function FilterBar() {
  const { filters, setFilter, clearFilters } = useKanbanStore();
  const tasks = useKanbanStore(state => state.tasks);
  
  // Get unique assignees and tags
  const assignees = [...new Set(tasks.map(t => t.assignee))];
  const allTags = [...new Set(tasks.flatMap(t => t.tags))];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-3 py-2 border rounded-lg"
              value={filters.search}
              onChange={(e) => setFilter({ search: e.target.value })}
            />
          </div>
        </div>
        
        {/* Assignee Filter */}
        <select
          className="px-3 py-2 border rounded-lg"
          value={filters.assignee || ''}
          onChange={(e) => setFilter({ assignee: e.target.value || null })}
        >
          <option value="">All Assignees</option>
          {assignees.map(assignee => (
            <option key={assignee} value={assignee}>
              {assignee}
            </option>
          ))}
        </select>
        
        {/* Tags Filter */}
        <select
          className="px-3 py-2 border rounded-lg"
          onChange={(e) => {
            const tag = e.target.value;
            if (tag && !filters.tags.includes(tag)) {
              setFilter({ tags: [...filters.tags, tag] });
            }
          }}
        >
          <option value="">Add Tag Filter</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        
        {/* Active Tags */}
        {filters.tags.length > 0 && (
          <div className="flex gap-2">
            {filters.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => setFilter({
                    tags: filters.tags.filter(t => t !== tag)
                  })}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
```

---

## Task 7: Task Detail Page

**Status**: ✅ COMPLETED  
**Priority**: HIGH  
**Time Estimate**: 30 minutes  
**Dependencies**: Task 2

### Description
Create dynamic route for task details with full information display.

### Files to Create

**src/app/task/[id]/page.tsx**:
```typescript
import { TaskDetail } from '@/components/task/TaskDetail';

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <TaskDetail taskId={params.id} />
      </div>
    </main>
  );
}
```

**src/components/task/TaskDetail.tsx**:
```typescript
'use client';

import { useKanbanStore } from '@/stores/kanbanStore';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function TaskDetail({ taskId }: { taskId: string }) {
  const router = useRouter();
  const task = useKanbanStore(state => 
    state.tasks.find(t => t.id === taskId)
  );
  
  if (!task) {
    return <div>Task not found</div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Board
      </button>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
          
          <div className="prose max-w-none">
            <h3>Description</h3>
            <p>{task.description}</p>
          </div>
          
          {task.subtasks && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Subtasks</h3>
              {task.subtasks.map(subtask => (
                <label key={subtask.id} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => {/* Handle subtask toggle */}}
                  />
                  <span className={subtask.completed ? 'line-through' : ''}>
                    {subtask.title}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Details
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {task.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Assignee</dt>
                <dd className="mt-1">{task.assignee}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Priority</dt>
                <dd className="mt-1 capitalize">{task.priority}</dd>
              </div>
              {task.dueDate && (
                <div>
                  <dt className="text-sm text-gray-500">Due Date</dt>
                  <dd className="mt-1">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Task 8: Backlog/List View

**Status**: ✅ COMPLETED  
**Priority**: MEDIUM  
**Time Estimate**: 30 minutes  
**Dependencies**: Task 2

### Description
Create table view for all tasks with sorting and bulk actions.

### Files to Create

**src/app/backlog/page.tsx**:
```typescript
import { BacklogView } from '@/components/backlog/BacklogView';

export default function BacklogPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Backlog / All Tasks</h1>
        <BacklogView />
      </div>
    </main>
  );
}
```

**src/components/backlog/BacklogView.tsx**:
```typescript
'use client';

import { useKanbanStore } from '@/stores/kanbanStore';
import Link from 'next/link';

export function BacklogView() {
  const tasks = useKanbanStore(state => state.getFilteredTasks());
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Assignee
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Priority
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Due Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {tasks.map(task => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-500">
                {task.id}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/task/${task.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {task.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-4 py-3 text-sm">
                {task.assignee}
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={task.priority} />
              </td>
              <td className="px-4 py-3 text-sm">
                {task.dueDate 
                  ? new Date(task.dueDate).toLocaleDateString()
                  : '-'
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Task 9: Create/Edit Task Modal

**Status**: ✅ COMPLETED  
**Priority**: MEDIUM  
**Time Estimate**: 30 minutes  
**Dependencies**: Task 2

### ✅ IMPLEMENTED FEATURES
- Full task creation and editing modal
- Form validation and error handling
- Status pre-selection from column context
- Tag input with autocomplete
- Date picker for due dates
- Assignee dropdown with existing users
- Priority selection

### Description
Implement modal for creating and editing tasks.

### Files to Create

**src/components/task/TaskModal.tsx**:
```typescript
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useKanbanStore } from '@/stores/kanbanStore';

interface TaskModalProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  const { addTask, updateTask } = useKanbanStore();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'scheduled',
    assignee: task?.assignee || '',
    priority: task?.priority || 'medium',
    tags: task?.tags || [],
    dueDate: task?.dueDate || null,
  });
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (task) {
      updateTask(task.id, formData);
    } else {
      const newTask: Task = {
        id: `TSK-${Date.now()}`,
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addTask(newTask);
    }
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          
          {/* Add more form fields */}
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## Task 10: Mobile Responsive Design

**Status**: ✅ COMPLETED  
**Priority**: MEDIUM  
**Dependencies**: Tasks 3-9

### ✅ IMPLEMENTED FEATURES
- Responsive grid layout (stacks columns on mobile)
- Touch-friendly drag and drop
- Mobile-optimized task cards
- Responsive filter bar
- Tested at 375px, 768px, 1024px+ breakpoints

### Description
Make the application fully responsive for mobile devices.

### Implementation Updates

**Update Kanban columns for mobile stacking:**
```typescript
// In KanbanBoard.tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* On mobile, show tabs for columns */}
  <div className="lg:hidden">
    <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
      {COLUMNS.map(status => (
        <button
          key={status}
          onClick={() => setActiveColumn(status)}
          className={`flex-1 px-3 py-2 rounded ${
            activeColumn === status ? 'bg-white shadow' : ''
          }`}
        >
          {status} ({getTaskCount(status)})
        </button>
      ))}
    </div>
  </div>
  
  {/* Show active column on mobile, all columns on desktop */}
</div>
```

**Add Floating Action Button for mobile:**
```typescript
// components/shared/FAB.tsx
export function FAB({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}
```

---

## Task 11: Loading and Empty States

**Status**: ✅ COMPLETED  
**Priority**: LOW  
**Time Estimate**: 20 minutes  
**Dependencies**: Task 3

### ✅ IMPLEMENTED FEATURES
- Comprehensive skeleton loading components
- Column-specific empty states with actionable CTAs
- Task detail page skeleton with proper static/dynamic elements
- Board and backlog loading states
- Smart loading indicators (only dynamic content animated)
- Empty state components for different scenarios

### Description
Add loading skeletons and empty state messages.

### Implemented Components

**src/components/shared/LoadingSkeleton.tsx**:
- `TaskCardSkeleton` - Individual task card loading state
- `KanbanColumnSkeleton` - Column with proper titles and colors
- `KanbanBoardSkeleton` - Full board with all three columns
- `TaskDetailSkeleton` - Detailed page skeleton with static UI elements
- `TaskCountLoader` - Animated spinner for task count badges
- `BacklogTableSkeleton` - Table view loading state
- `FilterBarSkeleton` - Filter controls skeleton

**src/components/shared/EmptyState.tsx**:
- `EmptyState` - Flexible empty state component
- `ColumnEmptyState` - Column-specific empty state with "Add task" CTA
- `NoTasksEmpty`, `NoSearchResultsEmpty`, etc. - Specific scenarios
- `ErrorState` - Error handling with retry actions

**src/components/shared/EmptyState.tsx**:
```typescript
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
```

---

## Task 12: Documentation

**Status**: 🔴 Not Started  
**Priority**: HIGH  
**Time Estimate**: 20 minutes  
**Dependencies**: All features complete

### Description
Create comprehensive README with all required sections.

### README.md Structure
```markdown
# Kanban Task Management System

## 🚀 Live Demo
[View Live Demo](https://kanban-board.vercel.app)

## 📋 Features
- ✅ Three-column Kanban board (Scheduled, In Progress, Done)
- ✅ Drag and drop tasks between columns
- ✅ Filter by text, assignee, or tags
- ✅ Task detail view with dynamic routing
- ✅ Backlog/list view for all tasks
- ✅ Mobile responsive design
- ✅ Local storage persistence
- ✅ Smart due date indicators

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Drag & Drop**: @dnd-kit
- **Hosting**: Vercel

## 📦 Installation

\`\`\`bash
# Clone the repository
git clone [repo-url]

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## 🏗️ Architecture Overview

The application follows a feature-based architecture:
- **State Management**: Zustand store with localStorage persistence
- **Routing**: Next.js App Router with dynamic segments
- **Components**: Modular, reusable components
- **Styling**: Utility-first with Tailwind CSS

## 🎯 Key Decisions & Tradeoffs

1. **Zustand over Redux**: Simpler API, less boilerplate
2. **@dnd-kit over react-beautiful-dnd**: Better accessibility
3. **LocalStorage over IndexedDB**: Simpler for this use case
4. **App Router over Pages**: Modern Next.js approach

## 🧪 Testing Approach

Manual testing focused on:
- Drag and drop functionality
- Filter combinations
- Mobile responsiveness
- Data persistence

## ⏱️ Time Spent

Estimated: 5 hours

- Setup & Configuration: 30 min
- Core Kanban Board: 1.5 hours
- Drag & Drop: 1 hour
- Filtering: 45 min
- Routes & Views: 1 hour
- Polish & Documentation: 45 min

## 🚀 Future Improvements

If I had more time:
- Add comprehensive test suite
- Implement keyboard shortcuts
- Add bulk operations
- Create task templates
- Add export/import functionality
- Implement real-time collaboration
```

---

## Task 13: Testing Implementation

**Status**: 🔴 Not Started  
**Priority**: HIGH  
**Time Estimate**: 45 minutes  
**Dependencies**: Tasks 3-10

### Description
Implement user-level tests using Jest and React Testing Library to verify core functionality and user interactions.

### Setup Steps
```bash
# Install testing dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom

# Install additional testing utilities
npm install -D @types/jest
```

### Configuration Files

**jest.config.js**:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)

## 🎯 Success Criteria Checklist

Before submission, ensure:

- [ ] TypeScript - No type errors
- [ ] Drag & Drop - Works smoothly between all columns
- [ ] Filtering - All filters work and combine correctly
- [ ] Routing - Task detail page works with dynamic ID
- [ ] Mobile - Responsive at 375px, 768px, 1024px+
- [ ] Persistence - Data survives page refresh
- [ ] Performance - No noticeable lag with 15+ tasks
- [ ] Code Quality - Clean, organized, documented
- [ ] Documentation - README complete and accurate
- [ ] Deployment - Live on Vercel with demo data: '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.{js,jsx,ts,tsx}',
    '**/*.test.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/app/layout.tsx',
    '!src/app/page.tsx',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

**jest.setup.js**:
```javascript
import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
```

### Test Files to Create

**src/__tests__/integration/KanbanBoard.test.tsx**:
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KanbanBoard } from '@/components/board/KanbanBoard'
import { useKanbanStore } from '@/stores/kanbanStore'

// Mock the store with test data
jest.mock('@/stores/kanbanStore')

describe('Kanban Board User Interactions', () => {
  beforeEach(() => {
    // Reset store before each test
    useKanbanStore.setState({
      tasks: mockTasks,
      filters: { search: '', assignee: null, tags: [] }
    })
  })

  test('User can view tasks in three columns', () => {
    render(<KanbanBoard />)
    
    // Check all three columns are rendered
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
    
    // Check task counts
    expect(screen.getByText('5', { selector: '.column-count' })).toBeInTheDocument()
  })

  test('User can search for tasks by title', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)
    
    const searchInput = screen.getByPlaceholderText('Search tasks...')
    await user.type(searchInput, 'authentication')
    
    // Should show only matching task
    await waitFor(() => {
      expect(screen.getByText('Implement user authentication')).toBeInTheDocument()
      expect(screen.queryByText('Fix navigation bug')).not.toBeInTheDocument()
    })
  })

  test('User can filter tasks by assignee', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)
    
    const assigneeSelect = screen.getByLabelText('Filter by assignee')
    await user.selectOptions(assigneeSelect, 'John Doe')
    
    // Should only show John Doe's tasks
    await waitFor(() => {
      const tasks = screen.getAllByTestId('task-card')
      tasks.forEach(task => {
        expect(task).toHaveTextContent('John Doe')
      })
    })
  })

  test('User can click on a task to view details', async () => {
    const user = userEvent.setup()
    const push = jest.fn()
    
    // Mock Next.js router
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push })
    }))
    
    render(<KanbanBoard />)
    
    const taskCard = screen.getByText('Implement user authentication')
    await user.click(taskCard)
    
    expect(push).toHaveBeenCalledWith('/task/TSK-001')
  })
})
```

**src/__tests__/integration/DragAndDrop.test.tsx**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import { KanbanBoard } from '@/components/board/KanbanBoard'

describe('Drag and Drop Functionality', () => {
  test('User can drag task between columns', async () => {
    const handleDragEnd = jest.fn()
    
    render(
      <DndContext onDragEnd={handleDragEnd}>
        <KanbanBoard />
      </DndContext>
    )
    
    // Get draggable task
    const task = screen.getByTestId('task-TSK-001')
    const targetColumn = screen.getByTestId('column-in-progress')
    
    // Simulate drag and drop
    fireEvent.dragStart(task)
    fireEvent.dragEnter(targetColumn)
    fireEvent.dragOver(targetColumn)
    fireEvent.drop(targetColumn)
    fireEvent.dragEnd(task)
    
    // Verify the drag end handler was called
    expect(handleDragEnd).toHaveBeenCalledWith(
      expect.objectContaining({
        active: expect.objectContaining({ id: 'TSK-001' }),
        over: expect.objectContaining({ 
          data: expect.objectContaining({ status: 'in-progress' })
        })
      })
    )
  })

  test('Dragging to same column does not trigger update', () => {
    const moveTask = jest.fn()
    useKanbanStore.setState({ moveTask })
    
    render(<KanbanBoard />)
    
    const task = screen.getByTestId('task-TSK-001')
    const sameColumn = screen.getByTestId('column-scheduled')
    
    fireEvent.dragStart(task)
    fireEvent.drop(sameColumn)
    fireEvent.dragEnd(task)
    
    expect(moveTask).not.toHaveBeenCalled()
  })
})
```

**src/__tests__/integration/TaskCRUD.test.tsx**:
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskModal } from '@/components/task/TaskModal'
import { useKanbanStore } from '@/stores/kanbanStore'

describe('Task CRUD Operations', () => {
  test('User can create a new task', async () => {
    const user = userEvent.setup()
    const addTask = jest.fn()
    useKanbanStore.setState({ addTask })
    
    render(<TaskModal isOpen={true} onClose={() => {}} />)
    
    // Fill in task form
    await user.type(screen.getByLabelText('Title'), 'New Test Task')
    await user.type(screen.getByLabelText('Description'), 'Task description here')
    await user.selectOptions(screen.getByLabelText('Assignee'), 'John Doe')
    await user.selectOptions(screen.getByLabelText('Priority'), 'high')
    
    // Submit form
    await user.click(screen.getByText('Create Task'))
    
    // Verify task was created
    expect(addTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Test Task',
        description: 'Task description here',
        assignee: 'John Doe',
        priority: 'high'
      })
    )
  })

  test('User can edit an existing task', async () => {
    const user = userEvent.setup()
    const updateTask = jest.fn()
    useKanbanStore.setState({ updateTask })
    
    const existingTask = {
      id: 'TSK-001',
      title: 'Original Title',
      description: 'Original description',
      status: 'scheduled',
      assignee: 'John Doe',
      priority: 'medium'
    }
    
    render(<TaskModal task={existingTask} isOpen={true} onClose={() => {}} />)
    
    // Clear and update title
    const titleInput = screen.getByLabelText('Title')
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Title')
    
    // Submit form
    await user.click(screen.getByText('Update Task'))
    
    expect(updateTask).toHaveBeenCalledWith('TSK-001', 
      expect.objectContaining({
        title: 'Updated Title'
      })
    )
  })

  test('User can delete a task', async () => {
    const user = userEvent.setup()
    const deleteTask = jest.fn()
    useKanbanStore.setState({ deleteTask })
    
    render(<TaskDetail taskId="TSK-001" />)
    
    // Click delete button
    await user.click(screen.getByText('Delete'))
    
    // Confirm deletion in dialog
    await user.click(screen.getByText('Confirm Delete'))
    
    expect(deleteTask).toHaveBeenCalledWith('TSK-001')
  })
})
```

**src/__tests__/integration/Filtering.test.tsx**:
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar } from '@/components/shared/FilterBar'
import { useKanbanStore } from '@/stores/kanbanStore'

describe('Filter Functionality', () => {
  test('User can combine multiple filters', async () => {
    const user = userEvent.setup()
    const setFilter = jest.fn()
    useKanbanStore.setState({ setFilter })
    
    render(<FilterBar />)
    
    // Apply text filter
    await user.type(screen.getByPlaceholderText('Search tasks...'), 'bug')
    
    // Apply assignee filter
    await user.selectOptions(screen.getByLabelText('Assignee'), 'John Doe')
    
    // Apply tag filter
    await user.click(screen.getByText('backend'))
    
    // Verify all filters are applied
    expect(setFilter).toHaveBeenCalledWith({ search: 'bug' })
    expect(setFilter).toHaveBeenCalledWith({ assignee: 'John Doe' })
    expect(setFilter).toHaveBeenCalledWith({ tags: ['backend'] })
  })

  test('User can clear all filters', async () => {
    const user = userEvent.setup()
    const clearFilters = jest.fn()
    useKanbanStore.setState({ 
      filters: { search: 'test', assignee: 'John Doe', tags: ['bug'] },
      clearFilters 
    })
    
    render(<FilterBar />)
    
    await user.click(screen.getByText('Clear filters'))
    
    expect(clearFilters).toHaveBeenCalled()
  })

  test('Filter results update in real-time', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)
    
    // Initially should show all tasks
    expect(screen.getAllByTestId('task-card')).toHaveLength(15)
    
    // Apply filter
    const searchInput = screen.getByPlaceholderText('Search tasks...')
    await user.type(searchInput, 'authentication')
    
    // Should show filtered results
    await waitFor(() => {
      expect(screen.getAllByTestId('task-card')).toHaveLength(1)
    })
  })
})
```

**src/__tests__/integration/PersistenceFlow.test.tsx**:
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KanbanBoard } from '@/components/board/KanbanBoard'

describe('Data Persistence', () => {
  test('User changes persist after page reload', async () => {
    const user = userEvent.setup()
    
    // Initial render
    const { unmount } = render(<KanbanBoard />)
    
    // Make a change (move task)
    const task = screen.getByTestId('task-TSK-001')
    const inProgressColumn = screen.getByTestId('column-in-progress')
    
    // Simulate drag to in-progress
    fireEvent.dragStart(task)
    fireEvent.drop(inProgressColumn)
    
    // Unmount (simulate page leave)
    unmount()
    
    // Re-render (simulate page reload)
    render(<KanbanBoard />)
    
    // Task should be in new column
    const inProgressTasks = within(screen.getByTestId('column-in-progress'))
      .getAllByTestId('task-card')
    
    expect(inProgressTasks).toContainEqual(
      expect.objectContaining({ 
        textContent: expect.stringContaining('Implement user authentication')
      })
    )
  })

  test('Filters persist across navigation', async () => {
    const user = userEvent.setup()
    
    render(<KanbanBoard />)
    
    // Apply filters
    await user.type(screen.getByPlaceholderText('Search tasks...'), 'bug')
    await user.selectOptions(screen.getByLabelText('Assignee'), 'John Doe')
    
    // Navigate away and back
    const { rerender } = render(<BacklogView />)
    rerender(<KanbanBoard />)
    
    // Filters should still be applied
    expect(screen.getByPlaceholderText('Search tasks...')).toHaveValue('bug')
    expect(screen.getByLabelText('Assignee')).toHaveValue('John Doe')
  })
})
```

**src/__tests__/integration/MobileInteractions.test.tsx**:
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KanbanBoard } from '@/components/board/KanbanBoard'

describe('Mobile User Experience', () => {
  beforeEach(() => {
    // Mock mobile viewport
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(max-width: 640px)',
      media: query,
      // ... other properties
    }))
  })

  test('User can switch between columns on mobile', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)
    
    // Should show column tabs on mobile
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    
    // Click on "In Progress" tab
    await user.click(screen.getByRole('tab', { name: /in progress/i }))
    
    // Should show in-progress tasks
    expect(screen.getByTestId('active-column')).toHaveTextContent('In Progress')
  })

  test('User can use FAB to create task on mobile', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)
    
    // FAB should be visible on mobile
    const fab = screen.getByTestId('fab-new-task')
    expect(fab).toBeInTheDocument()
    
    // Click FAB
    await user.click(fab)
    
    // Should open task modal
    expect(screen.getByText('New Task')).toBeInTheDocument()
  })

  test('Touch gestures work for task interactions', async () => {
    render(<KanbanBoard />)
    
    const taskCard = screen.getByTestId('task-TSK-001')
    
    // Simulate touch to open task
    fireEvent.touchStart(taskCard)
    fireEvent.touchEnd(taskCard)
    
    // Should navigate to task detail
    await waitFor(() => {
      expect(window.location.pathname).toBe('/task/TSK-001')
    })
  })
})
```

### Update package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

### Testing Best Practices

1. **Focus on user behavior**, not implementation details
2. **Test the happy path** and key error cases
3. **Use data-testid** for reliable element selection
4. **Mock external dependencies** (router, API calls)
5. **Test accessibility** with screen reader queries

### Coverage Goals
- Aim for **70-80% coverage** of critical paths
- Focus on:
  - Task CRUD operations
  - Drag and drop functionality
  - Filter combinations
  - Data persistence
  - Mobile interactions

---

## 🎯 Success Criteria Checklist

Before submission, ensure:

- [ ] TypeScript - No type errors
- [ ] Drag & Drop - Works smoothly between all columns
- [ ] Filtering - All filters work and combine correctly
- [ ] Routing - Task detail page works with dynamic ID
- [ ] Mobile - Responsive at 375px, 768px, 1024px+
- [ ] Persistence - Data survives page refresh
- [ ] Performance - No noticeable lag with 15+ tasks
- [ ] Code Quality - Clean, organized, documented
- [ ] Documentation - README complete and accurate
- [ ] Deployment - Live on Vercel with demo data