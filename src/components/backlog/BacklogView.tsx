'use client';

import { useKanbanStore } from '@/stores/kanbanStore';
import Link from 'next/link';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    'scheduled': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'done': 'bg-green-100 text-green-800'
  };

  const statusLabels = {
    'scheduled': 'Scheduled',
    'in-progress': 'In Progress',
    'done': 'Done'
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig[status as keyof typeof statusConfig]}`}>
      {statusLabels[status as keyof typeof statusLabels]}
    </span>
  );
}

function PriorityBadge({ priority }: { priority?: string }) {
  if (!priority) return <span className="text-gray-400">-</span>;

  const priorityConfig = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${priorityConfig[priority as keyof typeof priorityConfig]}`}>
      {priority}
    </span>
  );
}

export function BacklogView() {
  const { tasks, filters } = useKanbanStore();
  
  // Filter tasks locally to avoid infinite loop
  const filteredTasks = tasks.filter((task) => {
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
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No tasks found matching current filters
                </td>
              </tr>
            ) : (
              filteredTasks.map(task => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/task/${task.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium group flex items-center gap-1"
                        >
                          {task.title}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {task.id}
                      </div>
                      <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {task.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-gray-900">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {task.dueDate 
                      ? format(task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate), 'MMM d, yyyy')
                      : <span className="text-gray-400">-</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {task.tags.length === 0 ? (
                        <span className="text-gray-400 text-sm">-</span>
                      ) : (
                        task.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/task/${task.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {filteredTasks.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}