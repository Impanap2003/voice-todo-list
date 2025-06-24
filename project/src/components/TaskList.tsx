import React from 'react';
import { TaskItem } from './TaskItem';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdate, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-400 dark:text-gray-500">
          Add your first task above to get started!
        </p>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const overdueTasks = pendingTasks.filter(task => 
    task.reminder_time && new Date(task.reminder_time) < new Date()
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="text-blue-500 mr-2" size={20} />
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pendingTasks.length}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Pending</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle2 className="text-green-500 mr-2" size={20} />
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks.length}</p>
              <p className="text-sm text-green-600 dark:text-green-400">Completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueTasks.length}</p>
              <p className="text-sm text-red-600 dark:text-red-400">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Lists */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};