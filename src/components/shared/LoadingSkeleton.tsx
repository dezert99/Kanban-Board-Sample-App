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

export function KanbanColumnSkeleton() {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
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
      <KanbanColumnSkeleton />
      <KanbanColumnSkeleton />
      <KanbanColumnSkeleton />
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