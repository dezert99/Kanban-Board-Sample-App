'use client';

import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

const COLUMN_CONFIG = {
  'scheduled': {
    title: 'Scheduled',
    bgColor: 'bg-gray-100',
    headerColor: 'text-gray-700'
  },
  'in-progress': {
    title: 'In Progress',
    bgColor: 'bg-blue-50',
    headerColor: 'text-blue-700'
  },
  'done': {
    title: 'Done',
    bgColor: 'bg-green-50',
    headerColor: 'text-green-700'
  }
};

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const config = COLUMN_CONFIG[status];
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      status,
    },
  });
  
  return (
    <div className={`${config.bgColor} rounded-lg p-4 h-fit`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`font-semibold ${config.headerColor}`}>
          {config.title}
        </h2>
        <span className="bg-white text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
          {tasks.length}
        </span>
      </div>
      
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div 
          ref={setNodeRef}
          className={`space-y-3 min-h-[200px] transition-colors ${
            isOver ? 'bg-blue-50 bg-opacity-50' : ''
          }`}
        >
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No tasks in {config.title.toLowerCase()}
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}