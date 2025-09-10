# Technical Architecture - Kanban Task Management System

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Router                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Board      │  │   Backlog    │  │  Task Detail  │     │
│  │   View       │  │   View       │  │    View       │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │             │
│  ┌──────▼──────────────────▼──────────────────▼───────┐    │
│  │              Zustand State Store                    │    │
│  │  - Tasks, Filters, UI State                        │    │
│  │  - Persist Middleware → LocalStorage               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Component Library                       │    │
│  │  - Board Components (Column, Card)                  │    │
│  │  - UI Components (Modal, Button, Input)            │    │
│  │  - Shared Components (FilterBar, Avatar)           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Key Architectural Decisions

### 1. State Management: Zustand vs Context API vs Redux

**Decision**: Zustand with persist middleware

**Rationale**:
- **Simplicity**: Less boilerplate than Redux
- **Performance**: Better than Context API for frequent updates
- **Persistence**: Built-in localStorage middleware
- **DevX**: Excellent TypeScript support and DevTools
- **Size**: Only 8kb gzipped

**Implementation**:
```typescript
// Single store with slices for different features
const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      // State slices
      tasks: [],
      filters: defaultFilters,
      
      // Actions organized by feature
      // Task management
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
      })),
      
      // Filter management
      setFilter: (filter) => set((state) => ({
        filters: { ...state.filters, ...filter }
      })),
    }),
    {
      name: 'kanban-storage',
      version: 1,
    }
  )
);
```

### 2. Routing: App Router vs Pages Router

**Decision**: Next.js App Router

**Rationale**:
- **Modern**: Latest Next.js paradigm
- **Performance**: Server Components by default
- **Layouts**: Nested layouts for better code organization
- **Streaming**: Progressive rendering capabilities
- **Future-proof**: Recommended approach for new projects

**Route Structure**:
```
app/
├── layout.tsx          # Root layout with navigation
├── page.tsx           # Board view (default route)
├── backlog/
│   └── page.tsx       # Table/list view
└── task/
    └── [id]/
        └── page.tsx   # Dynamic route for task details
```

### 3. Drag and Drop: @dnd-kit vs react-beautiful-dnd

**Decision**: @dnd-kit

**Rationale**:
- **Accessibility**: Better keyboard and screen reader support
- **Mobile**: Superior touch handling
- **Performance**: More efficient rendering
- **Flexibility**: Highly customizable
- **Maintenance**: Actively maintained (react-beautiful-dnd is not)

**Implementation Pattern**:
```typescript
// Sortable lists with keyboard support
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
    {tasks.map(task => (
      <SortableTaskCard key={task.id} task={task} />
    ))}
  </SortableContext>
</DndContext>
```

### 4. Styling: Tailwind vs CSS Modules vs Styled Components

**Decision**: Tailwind CSS

**Rationale**:
- **Speed**: Rapid prototyping with utility classes
- **Consistency**: Design system built-in
- **Performance**: No runtime overhead
- **Maintenance**: No CSS file management
- **Assessment**: Explicitly requested in requirements

**Organization Pattern**:
```tsx
// Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  conditionalClass && "conditional-classes",
  {
    "variant-a": variant === 'a',
    "variant-b": variant === 'b',
  }
)} />
```

### 5. Data Persistence: LocalStorage vs IndexedDB vs Backend

**Decision**: LocalStorage with Zustand persist

**Rationale**:
- **Simplicity**: No backend required per requirements
- **Sufficient**: 5-10MB storage is plenty for tasks
- **Synchronous**: Simpler mental model
- **Browser Support**: Universal support

**Limitations Acknowledged**:
- 5MB storage limit (fine for this use case)
- Synchronous API (not an issue for small datasets)
- No real multi-tab sync (acceptable for assessment)

## 📊 Data Flow Architecture

```
User Action → Component Event Handler → Zustand Action → State Update → React Re-render
                                              ↓
                                        LocalStorage
```

### State Update Flow Example:
```typescript
// 1. User drags task
onDragEnd(event) 

// 2. Component handles event
const taskId = event.active.id;
const newStatus = event.over.data.status;

// 3. Call store action
moveTask(taskId, newStatus);

// 4. Store updates state
set(state => ({
  tasks: state.tasks.map(task =>
    task.id === taskId 
      ? { ...task, status: newStatus }
      : task
  )
}));

// 5. Persist middleware saves to localStorage
// 6. React re-renders affected components
```

## 🧩 Component Architecture

### Component Hierarchy
```
App
├── Layout
│   ├── Navigation
│   └── Children
├── BoardView
│   ├── FilterBar
│   ├── KanbanBoard
│   │   ├── KanbanColumn (x3)
│   │   │   ├── ColumnHeader
│   │   │   └── TaskCard (multiple)
│   │   │       ├── TaskHeader
│   │   │       ├── TaskBody
│   │   │       └── TaskFooter
│   │   └── DragOverlay
│   └── TaskModal
├── BacklogView
│   ├── FilterBar
│   ├── DataTable
│   │   ├── TableHeader
│   │   ├── TableBody
│   │   │   └── TableRow (multiple)
│   │   └── TablePagination
│   └── BulkActions
└── TaskDetailView
    ├── Breadcrumb
    ├── TaskDetail
    │   ├── TaskInfo
    │   ├── SubtaskList
    │   └── ActivityFeed
    └── TaskSidebar
```

### Component Design Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Build complex UIs from simple parts
3. **Props over State**: Lift state up when possible
4. **Controlled Components**: Forms and inputs controlled by parent
5. **Accessibility First**: ARIA labels and keyboard navigation

## 🔄 Performance Optimizations

### Rendering Optimizations
```typescript
// 1. Memoize expensive computations
const filteredTasks = useMemo(
  () => applyFilters(tasks, filters),
  [tasks, filters]
);

// 2. Memoize components that re-render frequently
const TaskCard = memo(({ task, onEdit }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return prevProps.task.updatedAt === nextProps.task.updatedAt;
});

// 3. Virtualize long lists
const VirtualBacklog = ({ tasks }) => {
  if (tasks.length > 50) {
    return <VirtualList items={tasks} />;
  }
  return <RegularList items={tasks} />;
};
```

### State Management Optimizations
```typescript
// Use selectors to prevent unnecessary re-renders
const scheduledTasks = useKanbanStore(
  state => state.tasks.filter(t => t.status === 'scheduled')
);

// Batch updates when possible
const batchUpdate = () => {
  useKanbanStore.setState(state => ({
    tasks: newTasks,
    filters: newFilters,
    lastSync: Date.now()
  }));
};
```

## 🔒 Security Considerations

### Client-Side Security
- **Input Sanitization**: Sanitize user inputs before display
- **XSS Prevention**: Use React's built-in escaping
- **Local Storage**: Don't store sensitive data
- **Content Security Policy**: Configure CSP headers

```typescript
// Input sanitization example
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
};
```

## 🧪 Testing Strategy

### Testing Pyramid
```
         /\
        /  \  E2E Tests (5%)
       /    \  - Critical user journeys
      /──────\
     /        \ Integration Tests (25%)
    /          \ - Component interactions
   /            \ - Store operations
  /──────────────\
 /                \ Unit Tests (70%)
/                  \ - Utilities
────────────────────  - Pure functions
                      - Component logic
```

### Key Test Scenarios
```typescript
// Critical path E2E test
test('User can complete full task lifecycle', async () => {
  // Create task
  // Move through columns
  // Edit task
  // Complete task
  // Verify persistence
});
```

## 📱 Responsive Design Architecture

### Breakpoint Strategy
```typescript
// Tailwind breakpoints aligned with device categories
const breakpoints = {
  mobile: '640px',   // sm: Most phones
  tablet: '768px',   // md: Tablets and large phones
  laptop: '1024px',  // lg: Small laptops
  desktop: '1280px', // xl: Desktop monitors
};

// Component behavior changes
<div className="
  grid grid-cols-1        // Mobile: Single column
  sm:grid-cols-2          // Tablet: Two columns  
  lg:grid-cols-3          // Desktop: Three columns
">
```

### Mobile-First Approach
1. Design for mobile by default
2. Enhance for larger screens
3. Touch-first interactions
4. Thumb-friendly tap targets (min 44px)

## 🚀 Deployment Architecture

### Build & Deploy Pipeline
```yaml
Build Process:
1. Install dependencies
2. Run TypeScript checks
3. Run linter
4. Run tests (if implemented)
5. Build Next.js application
6. Deploy to Vercel

Environment Variables:
- NEXT_PUBLIC_APP_URL (for canonical URLs)
- NEXT_PUBLIC_DEMO_MODE (to load sample data)
```

### Production Optimizations
- **Static Generation**: Where possible
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with App Router
- **Font Optimization**: Next.js Font optimization

## 📈 Scalability Considerations

### Current Limitations
- LocalStorage: ~5MB limit
- Synchronous storage operations
- Client-side only filtering
- No real-time collaboration

### Future Scaling Path
```typescript
// Easy migration path to backend
interface TaskService {
  getTasks(): Promise<Task[]>;
  createTask(task: Task): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}

// Swap implementations
const taskService: TaskService = 
  process.env.USE_API 
    ? new APITaskService()      // Future: API calls
    : new LocalTaskService();    // Current: LocalStorage
```

## 🎨 Design System Architecture

### Component Variants
```typescript
// Consistent variant patterns across components
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  // ... other props
}
```

### Color System
```typescript
// Semantic color tokens
const colors = {
  // Priority colors
  priority: {
    critical: 'red',
    high: 'orange',
    medium: 'yellow',
    low: 'green',
  },
  // Status colors
  status: {
    scheduled: 'gray',
    'in-progress': 'blue',
    done: 'green',
  },
  // Due date colors
  dueDate: {
    overdue: 'red',
    today: 'orange',
    upcoming: 'blue',
    none: 'gray',
  }
};
```

## 📝 Code Organization Best Practices

### File Structure Patterns
```typescript
// Feature-based organization
components/
  board/
    KanbanBoard.tsx        // Main component
    KanbanBoard.test.tsx   // Tests
    KanbanBoard.types.ts   // Types
    index.ts              // Barrel export

// Shared utilities
lib/
  utils.ts               // General utilities
  constants.ts           // App constants
  cn.ts                 // Class name utility
```

### Import Organization
```typescript
// Order imports consistently
import React from 'react';                    // 1. React
import { useRouter } from 'next/navigation';  // 2. Next.js
import { DndContext } from '@dnd-kit/core';   // 3. Third-party
import { useKanbanStore } from '@/stores';    // 4. Internal stores
import { TaskCard } from '@/components';      // 5. Internal components
import { formatDate } from '@/lib/utils';     // 6. Internal utilities
import type { Task } from '@/types';          // 7. Types
import styles from './styles.module.css';     // 8. Styles
```

This architecture provides a solid foundation for building a performant, maintainable, and scalable Kanban board application within the assessment constraints.