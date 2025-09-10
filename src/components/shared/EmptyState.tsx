import { Plus, Search, Filter, FileText, Clipboard, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  type?: 'no-tasks' | 'no-search-results' | 'no-filter-results' | 'task-not-found' | 'error';
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

export function EmptyState({ 
  type = 'no-tasks', 
  title, 
  message, 
  action,
  className = '' 
}: EmptyStateProps) {
  const configs = {
    'no-tasks': {
      icon: <Clipboard className="w-16 h-16 mx-auto text-gray-400" />,
      defaultTitle: 'No tasks yet',
      defaultMessage: 'Get started by creating your first task to organize your work.',
      actionIcon: <Plus className="w-4 h-4" />
    },
    'no-search-results': {
      icon: <Search className="w-16 h-16 mx-auto text-gray-400" />,
      defaultTitle: 'No results found',
      defaultMessage: 'Try adjusting your search terms or clearing filters to see more tasks.',
      actionIcon: <Search className="w-4 h-4" />
    },
    'no-filter-results': {
      icon: <Filter className="w-16 h-16 mx-auto text-gray-400" />,
      defaultTitle: 'No tasks match your filters',
      defaultMessage: 'Try changing your filter criteria or clearing filters to see more tasks.',
      actionIcon: <Filter className="w-4 h-4" />
    },
    'task-not-found': {
      icon: <FileText className="w-16 h-16 mx-auto text-gray-400" />,
      defaultTitle: 'Task not found',
      defaultMessage: 'The task you\'re looking for doesn\'t exist or has been deleted.',
      actionIcon: <Clipboard className="w-4 h-4" />
    },
    'error': {
      icon: <AlertCircle className="w-16 h-16 mx-auto text-red-400" />,
      defaultTitle: 'Something went wrong',
      defaultMessage: 'We encountered an error while loading your tasks. Please try again.',
      actionIcon: <Plus className="w-4 h-4" />
    }
  };

  const config = configs[type];
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="mb-4">
        {config.icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {displayTitle}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {displayMessage}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {action.icon || config.actionIcon}
          {action.label}
        </button>
      )}
    </div>
  );
}

// Specific empty state components for different use cases
export function NoTasksEmpty({ onCreateTask }: { onCreateTask: () => void }) {
  return (
    <EmptyState
      type="no-tasks"
      action={{
        label: 'Create your first task',
        onClick: onCreateTask,
      }}
    />
  );
}

export function NoSearchResultsEmpty({ onClearSearch }: { onClearSearch: () => void }) {
  return (
    <EmptyState
      type="no-search-results"
      action={{
        label: 'Clear search',
        onClick: onClearSearch,
      }}
    />
  );
}

export function NoFilterResultsEmpty({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <EmptyState
      type="no-filter-results"
      action={{
        label: 'Clear filters',
        onClick: onClearFilters,
      }}
    />
  );
}

export function TaskNotFoundEmpty({ onGoBack }: { onGoBack: () => void }) {
  return (
    <EmptyState
      type="task-not-found"
      action={{
        label: 'Back to board',
        onClick: onGoBack,
      }}
    />
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      type="error"
      action={{
        label: 'Try again',
        onClick: onRetry,
      }}
    />
  );
}

// Column-specific empty state
export function ColumnEmptyState({ 
  columnName, 
  onCreateTask 
}: { 
  columnName: string; 
  onCreateTask: () => void; 
}) {
  return (
    <div className="text-center py-8 px-4">
      <div className="text-gray-400 mb-3">
        <Plus className="w-8 h-8 mx-auto" />
      </div>
      <p className="text-sm text-gray-500 mb-3">
        No tasks in {columnName.toLowerCase()}
      </p>
      <button
        onClick={onCreateTask}
        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
      >
        Add a task
      </button>
    </div>
  );
}