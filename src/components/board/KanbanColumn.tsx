'use client';

import { memo } from 'react';
import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  activeTask?: Task | null;
  overId?: string | null;
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

export const KanbanColumn = memo(function KanbanColumn({ status, tasks, activeTask, overId }: KanbanColumnProps) {
  const config = COLUMN_CONFIG[status];
  
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      status,
    },
  });
  
  const isActiveTaskInThisColumn = activeTask && tasks.find(t => t.id === activeTask.id);
  const isDraggingFromOtherColumn = activeTask && !isActiveTaskInThisColumn;
  const isOverThisColumn = overId === status;
  const isOverTaskInThisColumn = overId && tasks.find(t => t.id === overId);
  const isDragging = !!activeTask;
  
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
          className={`space-y-3 min-h-[200px] ${
            isOver && isDragging && !isActiveTaskInThisColumn ? 'bg-blue-50 bg-opacity-30 rounded-lg' : ''
          }`}
        >
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              {isDragging && (isOverThisColumn || isOver) && !isActiveTaskInThisColumn ? (
                <div className="mb-4 p-4 border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg text-blue-600 font-medium">
                  Drop here
                </div>
              ) : null}
              {`No tasks in ${config.title.toLowerCase()}`}
            </div>
          ) : (
            tasks.map((task, index) => {
              // Show indicator before task if we're hovering over it
              const showIndicatorBefore = 
                isDragging && overId === task.id && activeTask?.id !== task.id;
              
              // Show indicator after last task if hovering over column but not over specific task
              const showIndicatorAfter = 
                isDragging && 
                index === tasks.length - 1 && 
                isOverThisColumn && 
                !isOverTaskInThisColumn &&
                activeTask?.id !== task.id;
              
              return (
                <div key={task.id}>
                  {showIndicatorBefore && (
                    <div className="h-1 bg-blue-400 rounded-full mx-2 mb-2 opacity-80" />
                  )}
                  <TaskCard task={task} />
                  {showIndicatorAfter && (
                    <div className="h-1 bg-blue-400 rounded-full mx-2 mt-2 opacity-80" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </SortableContext>
    </div>
  );
});