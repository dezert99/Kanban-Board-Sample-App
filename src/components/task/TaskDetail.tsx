'use client';

import { useKanbanStore } from '@/stores/kanbanStore';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, Flag, Tag, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { InlineTextEdit, InlineSelect, InlineTagEdit, InlineDateEdit, InlineComboBox } from './InlineEdit';
import { TaskStatus, Priority } from '@/types';

interface TaskDetailProps {
  taskId: string;
}

export function TaskDetail({ taskId }: TaskDetailProps) {
  const router = useRouter();
  const { tasks, updateTask } = useKanbanStore();
  const task = tasks.find(t => t.id === taskId);
  
  // Get all unique assignees and tags for dropdowns
  const allAssignees = [...new Set(tasks.map(t => t.assignee))];
  const allTags = [...new Set(tasks.flatMap(t => t.tags))];
  
  if (!task) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Task not found</h1>
          <p className="text-gray-600 mb-4">The task you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Board
          </button>
        </div>
      </div>
    );
  }

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const assigneeOptions = allAssignees.map(assignee => ({
    value: assignee,
    label: assignee
  }));

  const priorityColors = {
    low: 'text-green-700 bg-green-100',
    medium: 'text-yellow-700 bg-yellow-100',
    high: 'text-orange-700 bg-orange-100',
    critical: 'text-red-700 bg-red-100',
  };

  const statusColors = {
    'scheduled': 'text-gray-700 bg-gray-100',
    'in-progress': 'text-blue-700 bg-blue-100',
    'done': 'text-green-700 bg-green-100'
  };

  const handleUpdate = (field: string, value: any) => {
    updateTask(task.id, { [field]: value });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Board
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="group">
              <InlineTextEdit
                value={task.title}
                onChange={(value) => handleUpdate('title', value)}
                placeholder="Enter task title..."
                className="text-3xl font-bold text-gray-900 mb-2 min-h-[2.5rem]"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{task.id}</span>
              <span>•</span>
              <span>Created {format(task.createdAt instanceof Date ? task.createdAt : new Date(task.createdAt), 'MMM d, yyyy')}</span>
              {(task.updatedAt instanceof Date ? task.updatedAt : new Date(task.updatedAt)).getTime() !== (task.createdAt instanceof Date ? task.createdAt : new Date(task.createdAt)).getTime() && (
                <>
                  <span>•</span>
                  <span>Updated {format(task.updatedAt instanceof Date ? task.updatedAt : new Date(task.updatedAt), 'MMM d, yyyy')}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <InlineTextEdit
              value={task.description}
              onChange={(value) => handleUpdate('description', value)}
              placeholder="Add a description..."
              multiline={true}
              className="text-gray-700 leading-relaxed min-h-[4rem]"
            />
          </div>
          
          {task.subtasks && task.subtasks.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Subtasks</h2>
              <div className="space-y-3">
                {task.subtasks.map(subtask => (
                  <label key={subtask.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      readOnly
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {subtask.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
            <dl className="space-y-4">
              <div>
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                  <Flag className="w-4 h-4" />
                  Status
                </dt>
                <dd>
                  <InlineSelect
                    value={task.status}
                    onChange={(value) => handleUpdate('status', value as TaskStatus)}
                    options={statusOptions}
                    renderValue={(value) => (
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColors[value as TaskStatus]}`}>
                        {statusOptions.find(opt => opt.value === value)?.label}
                      </span>
                    )}
                  />
                </dd>
              </div>
              
              <div>
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                  <User className="w-4 h-4" />
                  Assignee
                </dt>
                <dd>
                  <InlineComboBox
                    value={task.assignee}
                    onChange={(value) => handleUpdate('assignee', value)}
                    options={allAssignees}
                    placeholder="Assign to someone..."
                    renderValue={(value) => (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                          {value.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    )}
                  />
                </dd>
              </div>
              
              <div>
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                  <Flag className="w-4 h-4" />
                  Priority
                </dt>
                <dd>
                  <InlineSelect
                    value={task.priority || 'medium'}
                    onChange={(value) => handleUpdate('priority', value as Priority)}
                    options={priorityOptions}
                    renderValue={(value) => (
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${priorityColors[value as Priority]}`}>
                        {value}
                      </span>
                    )}
                  />
                </dd>
              </div>
              
              <div>
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  Due Date
                </dt>
                <dd>
                  <InlineDateEdit
                    value={task.dueDate ? (task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate)) : undefined}
                    onChange={(value) => handleUpdate('dueDate', value)}
                    placeholder="Set due date"
                  />
                </dd>
              </div>
              
              <div>
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </dt>
                <dd>
                  <InlineTagEdit
                    tags={task.tags}
                    onChange={(value) => handleUpdate('tags', value)}
                    allTags={allTags}
                  />
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}