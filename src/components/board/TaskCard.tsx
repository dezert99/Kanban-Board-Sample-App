'use client';

import { Task } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';
import { MouseEvent } from 'react';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();
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
  };

  const handleClick = (e: MouseEvent) => {
    // Only navigate if we're not dragging
    if (!isDragging) {
      e.preventDefault();
      router.push(`/task/${task.id}`);
    }
  };

  const priorityColors = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-orange-500',
    critical: 'border-l-red-500',
  };

  const getDueDateColor = (date: Date | undefined) => {
    if (!date) return '';
    
    // Ensure date is a Date object (in case it's a string from localStorage)
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const dayDiff = Math.ceil((dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff < 0) return 'bg-red-100 text-red-700'; // Overdue
    if (dayDiff <= 1) return 'bg-orange-100 text-orange-700'; // Due soon
    return 'bg-blue-100 text-blue-700'; // Future
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={cn(
        'bg-white rounded-lg shadow-sm p-3 cursor-move',
        'border-l-4 hover:shadow-md transition-shadow',
        priorityColors[task.priority || 'medium'],
        isDragging && 'opacity-50'
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
          {task.title}
        </h3>
        <span className="text-xs text-gray-500 ml-2 shrink-0">
          {task.id}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
            {task.assignee.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-sm text-gray-600 truncate">
            {task.assignee}
          </span>
        </div>
        
        {task.dueDate && (
          <span className={cn(
            'px-2 py-1 text-xs rounded font-medium',
            getDueDateColor(task.dueDate)
          )}>
            {format(task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate), 'MMM d')}
          </span>
        )}
      </div>
    </div>
  );
}