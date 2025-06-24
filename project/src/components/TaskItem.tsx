import React, { useState } from 'react';
import { Check, Edit2, Trash2, Clock, AlertTriangle, Calendar } from 'lucide-react';
import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const isOverdue = task.reminder_time && new Date(task.reminder_time) < new Date() && !task.completed;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 border-l-4 ${
      task.completed ? 'border-green-500 opacity-75' : 
      task.priority === 'high' ? 'border-red-500' :
      task.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
    }`}>
      <div className="flex items-start space-x-4">
        <button
          onClick={() => onUpdate(task.id, { completed: !task.completed })}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
          }`}
        >
          {task.completed && <Check size={14} />}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows={2}
                placeholder="Add description..."
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-900 dark:text-white ${
                  task.completed ? 'line-through opacity-60' : ''
                }`}>
                  {task.title}
                </h3>
                <div className="flex items-center space-x-2">
                  {isOverdue && (
                    <AlertTriangle size={16} className="text-red-500" title="Overdue" />
                  )}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              
              {task.description && (
                <p className={`text-sm text-gray-600 dark:text-gray-400 ${
                  task.completed ? 'line-through opacity-60' : ''
                }`}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {new Date(task.created_at).toLocaleDateString()}
                  </span>
                  {task.reminder_time && (
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {new Date(task.reminder_time).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Edit task"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};