export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
      <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
      <div className="h-32 bg-gray-200 rounded-lg"></div>
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-sm p-3 border-l-4 border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="w-4 h-4 bg-gray-200 rounded"></div>
      </div>
      
      <div className="space-y-1 mb-3">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      
      <div className="flex gap-1 mb-3">
        <div className="h-5 bg-gray-200 rounded w-12"></div>
        <div className="h-5 bg-gray-200 rounded w-16"></div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}

export function KanbanColumnSkeleton({ title, bgColor, headerColor }: { 
  title?: string; 
  bgColor?: string; 
  headerColor?: string; 
} = {}) {
  return (
    <div className={`${bgColor || 'bg-gray-100'} rounded-lg p-4`}>
      <div className="flex justify-between items-center mb-4">
        {title ? (
          <h2 className={`font-semibold ${headerColor || 'text-gray-700'}`}>
            {title}
          </h2>
        ) : (
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
        )}
        <div className="w-8 h-6 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      <div className="space-y-3">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    </div>
  );
}

export function KanbanBoardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KanbanColumnSkeleton 
        title="Scheduled" 
        bgColor="bg-gray-100" 
        headerColor="text-gray-700"
      />
      <KanbanColumnSkeleton 
        title="In Progress" 
        bgColor="bg-blue-50" 
        headerColor="text-blue-700"
      />
      <KanbanColumnSkeleton 
        title="Done" 
        bgColor="bg-green-50" 
        headerColor="text-green-700"
      />
    </div>
  );
}

// Loading state for individual column while data is loading
export function KanbanColumnLoadingState({ title, bgColor, headerColor }: { 
  title: string; 
  bgColor: string; 
  headerColor: string; 
}) {
  return (
    <div className={`${bgColor} rounded-lg p-4 h-fit`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`font-semibold ${headerColor}`}>
          {title}
        </h2>
        <div className="bg-white px-2 py-1 rounded-full text-sm font-medium">
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        </div>
      </div>
      
      <div className="space-y-3 min-h-[200px]">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <div className="animate-pulse bg-white rounded-lg shadow-sm p-3 border-l-4 border-gray-200 opacity-50">
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

// Compact loading spinner for task count
export function TaskCountLoader() {
  return (
    <div className="bg-white px-2 py-1 rounded-full text-sm font-medium flex items-center justify-center min-w-[32px]">
      <div className="w-3 h-3 animate-spin rounded-full border border-gray-300 border-t-blue-600"></div>
    </div>
  );
}

// FilterBar skeleton
export function FilterBarSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 animate-pulse">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

// Task detail page skeleton
export function TaskDetailSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Board
        </button>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Title and metadata */}
          <div className="mb-6">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <span>•</span>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
          
          {/* Subtasks placeholder */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subtasks</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
            <dl className="space-y-4">
              {/* Status */}
              <div>
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  Status
                </dt>
                <dd>
                  <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                </dd>
              </div>
              
              {/* Assignee */}
              <div>
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Assignee
                </dt>
                <dd>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                </dd>
              </div>
              
              {/* Priority */}
              <div>
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  Priority
                </dt>
                <dd>
                  <div className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                </dd>
              </div>
              
              {/* Due Date */}
              <div>
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Due Date
                </dt>
                <dd>
                  <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                </dd>
              </div>
              
              {/* Tags */}
              <div>
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Tags
                </dt>
                <dd>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <div className="h-4 bg-gray-200 rounded w-48 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-1">
          <div className="h-5 bg-gray-200 rounded w-12"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </td>
    </tr>
  );
}

export function BacklogTableSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: 8 }, (_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}