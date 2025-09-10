# Kanban Board

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd kanban-board

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Architecture Overview

This is a modern React-based kanban board application built with Next.js 15 and TypeScript. The architecture follows these key principles:

### Frontend Stack
- **Next.js 15** with App Router for the React framework
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Zustand** for state management with persistence
- **@dnd-kit** for drag-and-drop functionality
- **Lucide React** for icons

### State Management
- Centralized state using Zustand store (`src/stores/kanbanStore.ts`)
- Persistent data storage in localStorage
- Mock data integration for development

### Component Structure
- **Board Components**: KanbanBoard, KanbanColumn, TaskCard for the main board view
- **Task Components**: TaskModal, TaskDetail, InlineEdit for task management
- **Shared Components**: FilterBar, DropdownMenu, EmptyState for reusable UI elements
- **Layout**: App router pages for different views (board, backlog, task details)

### Data Flow
- Tasks flow through three columns: Scheduled → In Progress → Done
- Real-time filtering by search, assignee, and tags
- Drag-and-drop reordering within columns and between columns
- Persistent state across browser sessions

## Key Decisions & Tradeoffs

### State Management Choice
- **Zustand over Redux**: Chosen for simplicity and smaller bundle size while maintaining powerful state management capabilities
- **Persistence**: Implemented localStorage persistence to maintain user data across sessions during development

### Drag & Drop Implementation
- **@dnd-kit over react-beautiful-dnd**: More modern, better TypeScript support, and active maintenance
- **Custom collision detection**: Implemented to provide precise drag interactions and visual feedback

### Styling Approach
- **Tailwind CSS**: Utility-first approach for rapid development and consistent design system
- **Component-based styling**: Reusable style patterns through component composition

### Testing Strategy
- **Jest + React Testing Library**: Industry standard for React component testing
- **Component isolation**: Testing individual components with mock dependencies

## Accessibility & Performance Notes

### Accessibility
- Keyboard navigation support for drag-and-drop operations
- Semantic HTML structure with proper ARIA labels
- Focus management during modal interactions
- Color contrast compliance for task status indicators

### Performance
- **Client-side hydration**: ClientOnly wrapper prevents hydration mismatches
- **Optimized rendering**: React components optimized to minimize unnecessary re-renders
- **Lazy loading**: Loading skeletons for improved perceived performance
- **Efficient state updates**: Zustand provides optimized state subscriptions


## Testing Approach

### Test Coverage
- Component unit tests using React Testing Library
- Store logic testing with Jest
- User interaction testing with user-event
- Accessibility testing with jest-dom matchers

### Test Organization
- Co-located test files in `__tests__` directories for ease of discovery
- Mock data utilities in `test-utils.tsx`
- Jest configuration with jsdom environment

### What Was Tested
- Task CRUD operations in the Kanban store
- Component rendering and user interactions
- Filter and search functionality
- Modal and form behaviors
These were chosen as these were the key pieces of functionality for the application

## Time Spent

Estimated: X hours

## If I Had More Time...

If I had more time to extend this project beyond the 4-hour limit, I would implement:

### Task Management Enhancements
- **Subtask System**: Convert subtasks into linkable tasks within the application, creating a proper task hierarchy
- **Epics & Sprint Views**: Add support for agile development workflows with epic tracking and sprint planning boards
- **Comments System**: Allow users to comment on tasks with threaded discussions
- **Bulk Operations**: Select multiple tasks for mass updates (status changes, assignee updates, deletions)

### User Experience Improvements
- **Side Panel View**: Open task details in a slide-out panel while staying on the board
- **Enhanced Task Modal**: Redesign the create/edit modal with better visual hierarchy and improved form UX
- **Keyboard Shortcuts**: Add power-user features (N for new task, / for search, ESC to close modals)

### Advanced Filtering & Search
- **Complex Tag Filters**: Support AND/OR logic for tag combinations (e.g., "backend AND urgent")
- **Exclusion Filters**: Ability to exclude specific tags or assignees from results
- **Saved Filter Sets**: Save and name commonly used filter combinations
- **Global Search**: Search across all task fields including descriptions and comments

### Data Management
- **Export Functionality**: Export tasks to CSV/JSON for reporting and backup
- **Import System**: Bulk import tasks from spreadsheets or other project management tools
- **Task Templates**: Create reusable task templates for common workflows

### Multi-User Features
- **User Authentication**: Sign in/out functionality to track who created/modified tasks
- **User Attribution**: Tag comments and changes to specific users
- **Activity History**: Complete audit trail of all task modifications
- **Real-time Collaboration**: Live updates when multiple users are viewing the same board

### Performance & Architecture
- **Virtual Scrolling**: Handle boards with hundreds of tasks efficiently
- **Optimistic Updates**: Instant UI feedback with background synchronization
- **PWA Support**: Offline functionality with service workers
- **Database Backend**: Replace localStorage with a proper database for scalability