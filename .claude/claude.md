# Claude AI Assistant Guide - Kanban Task Management System

## 🎯 Project Overview

You are helping build a Kanban Task Management System for a job assessment. This is a 4-6 hour take-home project that demonstrates proficiency with Next.js, TypeScript, Tailwind CSS, and modern React patterns.

**Assessment Context**: This is a technical assessment with specific requirements. Code quality, architecture decisions, and user experience are all being evaluated.

## 🏗️ Tech Stack

### Core Technologies
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persist middleware
- **Drag & Drop**: @dnd-kit (accessible, mobile-friendly)
- **Data Persistence**: LocalStorage (no backend required)

### Key Libraries
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "zustand": "^4.4.0",
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/sortable": "^7.0.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.300.0"
  }
}
```

## 📁 Project Structure

```
kanban-board/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Board view (main)
│   │   ├── backlog/
│   │   │   └── page.tsx        # List/table view
│   │   └── task/
│   │       └── [id]/
│   │           └── page.tsx    # Task detail (dynamic route)
│   ├── components/
│   │   ├── board/
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   └── TaskCard.tsx
│   │   ├── ui/
│   │   │   ├── Modal.tsx
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   └── shared/
│   │       ├── FilterBar.tsx
│   │       └── DueDateChip.tsx
│   ├── stores/
│   │   └── kanbanStore.ts      # Zustand store
│   ├── hooks/
│   │   ├── useFilters.ts
│   │   └── useDragDrop.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── types/
│   │   └── index.ts            # TypeScript definitions
│   └── data/
│       └── mockData.ts         # 15 sample tasks
└── docs/
    ├── CLAUDE.md               # This file
    ├── ARCHITECTURE.md         # Technical decisions
    ├── TASKS.md               # Implementation tasks
    └── STATUS.md              # Implementation status
```

## 🎨 Design Patterns & Conventions

### Component Patterns
```tsx
// ✅ GOOD: Focused, single-responsibility components
export function TaskCard({ task, onEdit }: TaskCardProps) {
  return (
    <div className="...">
      <TaskHeader task={task} />
      <TaskBody task={task} />
      <TaskFooter task={task} onEdit={onEdit} />
    </div>
  );
}

// ❌ BAD: Monolithic components with too many responsibilities
```

### State Management Pattern
```typescript
// Store slice pattern with Zustand
interface KanbanStore {
  // State
  tasks: Task[];
  filters: FilterState;
  
  // Actions - grouped by feature
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
```

### Styling Conventions
```tsx
// Use Tailwind's design system consistently
// Group related utilities logically
<div className={cn(
  // Layout
  "flex flex-col gap-4",
  // Styling
  "bg-white rounded-lg shadow-sm",
  // Spacing
  "p-4",
  // Interactions
  "hover:shadow-md transition-shadow",
  // Conditional
  isActive && "ring-2 ring-blue-500"
)} />
```

### File Naming Conventions
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` with `use` prefix
- Utilities: `camelCase.ts`
- Types: `PascalCase` for interfaces/types
- Constants: `SCREAMING_SNAKE_CASE`

## 🚀 Implementation Guidelines

### Priority Order
1. **Core Functionality First**: Get drag-and-drop working before polish
2. **Data Before UI**: Implement store logic before complex components
3. **Desktop Then Mobile**: Build desktop, then adapt for mobile
4. **Function Over Form**: Working features before perfect styling

### Performance Considerations
```typescript
// ✅ Memoize expensive computations
const filteredTasks = useMemo(
  () => tasks.filter(matchesFilters),
  [tasks, filters]
);

// ✅ Virtualize long lists (>50 items)
// ✅ Debounce search inputs (300ms)
// ✅ Lazy load modals and heavy components
```

### Accessibility Requirements
- All interactive elements keyboard accessible
- ARIA labels on icon buttons
- Focus management in modals
- Announce drag/drop to screen readers
- Color contrast minimum 4.5:1

## 🔍 Task Data Model

```typescript
interface Task {
  // Required fields
  id: string;                    // Format: "TSK-XXX"
  title: string;
  description: string;
  status: 'scheduled' | 'in-progress' | 'done';
  assignee: string;              // User name
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  
  // Optional fields
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  
  // Extended features
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  comments?: Array<{
    id: string;
    author: string;
    content: string;
    createdAt: Date;
  }>;
  attachments?: string[];
  timeEstimate?: number;          // hours
  timeSpent?: number;             // hours
}

interface FilterState {
  search: string;
  assignee: string | null;
  tags: string[];
  priority: Priority | null;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}
```

## 🎯 Key Features to Implement

### Must Have (Core Functionality)
- [x] Three-column Kanban board (Scheduled, In Progress, Done)
- [x] Drag and drop between columns
- [x] Task CRUD operations
- [x] Filter by text, assignee, or tag
- [x] Task detail route with dynamic segment
- [x] Mobile-responsive design
- [x] Loading/empty/error states
- [x] Local storage persistence
- [x] User-level tests with Jest and React Testing Library

### Nice to Have
- [ ] Bulk operations
- [ ] Advanced filter combinations
- [ ] Keyboard shortcuts
- [ ] Export/import functionality
- [ ] Task templates

## 📝 Code Examples

### Task Card with Smart Due Date
```tsx
// components/board/TaskCard.tsx
export function TaskCard({ task }: { task: Task }) {
  const getDueDateColor = (date: Date | undefined) => {
    if (!date) return 'bg-gray-100 text-gray-600';
    
    const now = new Date();
    const tomorrow = addDays(now, 1);
    
    if (isBefore(date, now)) return 'bg-red-100 text-red-700';      // Overdue
    if (isBefore(date, tomorrow)) return 'bg-orange-100 text-orange-700'; // Due tomorrow
    return 'bg-blue-100 text-blue-700';  // Future
  };
  
  return (
    <div className={cn(
      'task-card',
      `priority-${task.priority || 'medium'}`
    )}>
      {/* Card content */}
      {task.dueDate && (
        <DueDateChip 
          date={task.dueDate} 
          className={getDueDateColor(task.dueDate)}
        />
      )}
    </div>
  );
}
```

### Drag and Drop Implementation
```tsx
// hooks/useDragDrop.ts
export function useDragDrop() {
  const { moveTask } = useKanbanStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.data.current?.status;
      
      if (newStatus) {
        moveTask(taskId, newStatus);
      }
    }
  };
  
  return { sensors, handleDragEnd };
}
```

### Filter System
```tsx
// stores/kanbanStore.ts
getFilteredTasks: () => {
  const { tasks, filters } = get();
  
  return tasks.filter(task => {
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
      const hasMatchingTag = filters.tags.some(tag => 
        task.tags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }
    
    return true;
  });
}
```

## 🚨 Common Pitfalls to Avoid

1. **Don't forget to persist state**: Use Zustand's persist middleware
2. **Handle drag edge cases**: Dragging to same column, invalid drops
3. **Optimize re-renders**: Use React.memo for TaskCard components
4. **Mobile drag support**: Test on actual devices, not just responsive mode
5. **Type safety**: Don't use `any` - define proper types for everything

## 🧪 Testing Approach

```typescript
// Quick smoke tests to verify core functionality
describe('Kanban Board', () => {
  it('should display tasks in correct columns', () => {});
  it('should move task between columns on drag', () => {});
  it('should filter tasks by search term', () => {});
  it('should persist changes to localStorage', () => {});
  it('should handle empty states gracefully', () => {});
});
```

## 📚 Resources

- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [Zustand Persist Middleware](https://github.com/pmndrs/zustand#persist-middleware)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎉 Final Checklist

Before submission:
- [ ] All TypeScript errors resolved
- [ ] Mobile responsive tested at 375px, 768px, 1024px+
- [ ] Drag and drop works smoothly
- [ ] Filters combine correctly
- [ ] Data persists on refresh
- [ ] README is comprehensive
- [ ] Deployed to Vercel successfully
- [ ] Code is clean and well-organized