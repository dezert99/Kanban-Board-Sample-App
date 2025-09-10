# Quick Reference - Common Patterns & Snippets

## 🚀 Quick Start Commands

```bash
# Initial setup
npx create-next-app@latest kanban-board --typescript --tailwind --app --src-dir
cd kanban-board
npm install zustand @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities date-fns lucide-react

# Development
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📁 File Creation Order

1. `src/types/index.ts` - Type definitions
2. `src/lib/utils.ts` - Utility functions
3. `src/data/mockData.ts` - Sample data
4. `src/stores/kanbanStore.ts` - State management
5. Components in order of dependency

## 🎨 Common Component Patterns

### Basic Component Structure
```typescript
// src/components/[feature]/ComponentName.tsx
'use client';  // Only if using hooks or browser APIs

import { ComponentProps } from '@/types';
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  // Props
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  return (
    <div className={cn(
      "base-classes",
      // conditional classes
    )}>
      {/* Content */}
    </div>
  );
}
```

### Zustand Store Pattern
```typescript
// Basic store slice
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create<StoreType>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      
      // Actions
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      
      // Computed values (use get())
      getFiltered: () => {
        const state = get();
        return state.items.filter(/* ... */);
      },
    }),
    {
      name: 'storage-key',
    }
  )
);
```

### Drag and Drop Pattern
```typescript
// Draggable component
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function DraggableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}
```

## 🎯 Common Tailwind Patterns

### Priority Color Classes
```typescript
const priorityColors = {
  low: 'border-l-green-500 bg-green-50',
  medium: 'border-l-yellow-500 bg-yellow-50',
  high: 'border-l-orange-500 bg-orange-50',
  critical: 'border-l-red-500 bg-red-50',
};

// Usage
<div className={priorityColors[task.priority || 'medium']}>
```

### Status Badge Colors
```typescript
const statusColors = {
  'scheduled': 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'done': 'bg-green-100 text-green-700',
};
```

### Responsive Grid
```typescript
// Mobile first approach
<div className="
  grid 
  grid-cols-1           // Mobile: 1 column
  md:grid-cols-2        // Tablet: 2 columns
  lg:grid-cols-3        // Desktop: 3 columns
  gap-4                 // Consistent gap
">
```

## 🔧 Utility Functions

### Class Name Merger (cn)
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Date Formatting
```typescript
// src/lib/dateUtils.ts
import { format, formatDistanceToNow, isBefore, isToday, isTomorrow } from 'date-fns';

export const formatDueDate = (date: Date) => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isBefore(date, new Date())) return 'Overdue';
  return format(date, 'MMM d');
};

export const getDueDateColor = (date: Date | undefined) => {
  if (!date) return 'gray';
  if (isBefore(date, new Date())) return 'red';
  if (isToday(date) || isTomorrow(date)) return 'orange';
  return 'blue';
};
```

### ID Generation
```typescript
// Simple ID generator for new tasks
export const generateTaskId = () => {
  return `TSK-${Date.now().toString(36).toUpperCase()}`;
};
```

## 📝 TypeScript Patterns

### Type Guards
```typescript
// Check if value is Task
export const isTask = (value: any): value is Task => {
  return value && 
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    ['scheduled', 'in-progress', 'done'].includes(value.status);
};
```

### Generic Component Props
```typescript
// Extend HTML element props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

// With children
interface CardProps extends React.PropsWithChildren {
  title: string;
}
```

## 🏗️ Next.js App Router Patterns

### Dynamic Route
```typescript
// app/task/[id]/page.tsx
export default function TaskPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return <TaskDetail taskId={params.id} />;
}
```

### Loading State
```typescript
// app/loading.tsx
export default function Loading() {
  return <LoadingSkeleton />;
}
```

### Error Boundary
```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## 🎭 Common UI Patterns

### Modal Overlay
```typescript
export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg p-6 max-w-lg w-full">
        {children}
      </div>
    </div>
  );
}
```

### Loading Skeleton
```typescript
export function Skeleton({ className }) {
  return (
    <div className={cn(
      "animate-pulse bg-gray-200 rounded",
      className
    )} />
  );
}

// Usage
<Skeleton className="h-32 w-full mb-4" />
```

### Empty State
```typescript
export function EmptyState({ 
  icon: Icon = FileX,
  title = "No items found",
  description,
  action
}) {
  return (
    <div className="text-center py-12">
      <Icon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 mb-4">{description}</p>
      )}
      {action && (
        <button className="btn btn-primary">{action}</button>
      )}
    </div>
  );
}
```

## 🔍 Filter Implementation

### Basic Filter Logic
```typescript
const filterTasks = (tasks: Task[], filters: FilterState) => {
  return tasks.filter(task => {
    // Text search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matches = 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower);
      if (!matches) return false;
    }
    
    // Assignee filter
    if (filters.assignee && task.assignee !== filters.assignee) {
      return false;
    }
    
    // Tag filter (OR logic - any matching tag)
    if (filters.tags.length > 0) {
      const hasTag = filters.tags.some(tag => 
        task.tags.includes(tag)
      );
      if (!hasTag) return false;
    }
    
    return true;
  });
};
```

## 🚀 Performance Optimizations

### Memoization
```typescript
import { useMemo } from 'react';

// Memoize expensive computations
const filteredTasks = useMemo(
  () => filterTasks(tasks, filters),
  [tasks, filters]
);

// Memoize components
import { memo } from 'react';

export const TaskCard = memo(({ task }) => {
  // Component implementation
}, (prev, next) => prev.task.updatedAt === next.task.updatedAt);
```

### Debouncing
```typescript
import { useCallback, useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage
const debouncedSearch = useDebounce(searchTerm, 300);
```

## 🎯 Testing Patterns

### Basic Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { TaskCard } from './TaskCard';

describe('TaskCard', () => {
  it('renders task title', () => {
    const task = { 
      id: '1', 
      title: 'Test Task',
      // ... other required fields
    };
    
    render(<TaskCard task={task} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
```

## 📱 Mobile Responsive Helpers

### useMediaQuery Hook
```typescript
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  
  return matches;
}

// Usage
const isMobile = useMediaQuery('(max-width: 640px)');
const isTablet = useMediaQuery('(max-width: 1024px)');
```

## 🛠️ Debugging Tips

### Console Logging State
```typescript
// In Zustand store
const useStore = create((set, get) => ({
  // ... store implementation
  
  // Debug helper
  debug: () => console.log(get()),
}));

// Usage in component
const debug = useStore(state => state.debug);
useEffect(() => {
  debug(); // Log current state
}, []);
```

### React DevTools Helpers
```typescript
// Name your components for better debugging
ComponentName.displayName = 'ComponentName';

// Add debug props
if (process.env.NODE_ENV === 'development') {
  console.log('Render:', { props, state });
}
```

## 📦 Deployment Checklist

```bash
# Before deploying
- [ ] Remove all console.log statements
- [ ] Check for TypeScript errors: npm run tsc
- [ ] Run linter: npm run lint
- [ ] Test build: npm run build
- [ ] Test production mode: npm run start
- [ ] Check mobile responsiveness
- [ ] Verify localStorage persistence
- [ ] Test drag and drop in production build

# Vercel deployment
npm i -g vercel
vercel
# Follow prompts
```

## 🔗 Useful Links

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [date-fns Documentation](https://date-fns.org/docs/)