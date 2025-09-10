'use client';

import { useState } from 'react';
import { TaskStatus, Task } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { useKanbanStore } from '@/stores/kanbanStore';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  pointerWithin,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  CollisionDetection,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';

const COLUMNS: TaskStatus[] = ['scheduled', 'in-progress', 'done'];

interface KanbanBoardProps {
  onCreateTask?: (status: TaskStatus) => void;
  isLoading?: boolean;
}

export function KanbanBoard({ onCreateTask, isLoading }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const { getTasksByStatus, reorderTasksInColumn, moveTaskToColumn, tasks } = useKanbanStore();
  
  const customCollisionDetection: CollisionDetection = (args) => {
    // First, let's find if we're over any droppable areas
    const pointerCollisions = pointerWithin(args);
    const intersectionCollisions = rectIntersection(args);
    
    // Prefer pointer collisions (more precise)
    return pointerCollisions.length > 0 ? pointerCollisions : intersectionCollisions;
  };
  
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
  
  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };
  
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over ? over.id as string : null);
  };
  
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !activeTask) {
      setActiveTask(null);
      return;
    }
    
    const taskId = active.id as string;
    const overId = over.id as string;
    
    // Check if we're dropping over a column directly
    if (COLUMNS.includes(overId as TaskStatus)) {
      const overStatus = overId as TaskStatus;
      // Dropping over a column
      if (activeTask.status === overStatus) {
        // Same column - reorder within column
        const columnTasks = getTasksByStatus(overStatus);
        const oldIndex = columnTasks.findIndex(task => task.id === taskId);
        const newIndex = columnTasks.length; // Add to end of column
        
        if (oldIndex !== newIndex) {
          reorderTasksInColumn(overStatus, oldIndex, newIndex);
        }
      } else {
        // Different column - move to new column
        const targetIndex = getTasksByStatus(overStatus).length; // Add to end
        moveTaskToColumn(taskId, overStatus, targetIndex);
      }
    } else {
      // Dropping over another task - get status from data or find the task
      const overStatus = over.data.current?.status as TaskStatus;
      if (overStatus) {
        
        if (activeTask.status === overStatus) {
          // Same column - reorder
          const columnTasks = getTasksByStatus(overStatus);
          const oldIndex = columnTasks.findIndex(task => task.id === taskId);
          const newIndex = columnTasks.findIndex(task => task.id === overId);
          
          if (oldIndex !== newIndex) {
            reorderTasksInColumn(overStatus, oldIndex, newIndex);
          }
        } else {
          // Different column - move to position
          const targetIndex = getTasksByStatus(overStatus).findIndex(task => task.id === overId);
          moveTaskToColumn(taskId, overStatus, targetIndex);
        }
      }
    }
    
    setActiveTask(null);
    setOverId(null);
  };
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            activeTask={activeTask}
            overId={overId}
            onCreateTask={onCreateTask ? () => onCreateTask(status) : undefined}
            isLoading={isLoading}
          />
        ))}
      </div>
      
      <DragOverlay>
        {activeTask && (
          <div className="rotate-3 scale-105">
            <TaskCard task={activeTask} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}