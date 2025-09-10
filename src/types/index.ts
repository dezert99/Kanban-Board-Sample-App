export type TaskStatus = 'scheduled' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  tags: string[];
  priority?: Priority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface FilterState {
  search: string;
  assignee: string | null;
  tags: string[];
}