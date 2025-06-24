import React, { useState, useEffect } from 'react';
import { Plus, Calendar, AlertCircle } from 'lucide-react';
import { VoiceInput } from './VoiceInput';
import { useVoiceInput } from '../hooks/useVoiceInput';
import type { Task } from '../types';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void;
  loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [reminderTime, setReminderTime] = useState('');
  
  const { 
    isListening, 
    transcript, 
    error: voiceError,
    startListening, 
    stopListening, 
    clearTranscript 
  } = useVoiceInput();

  useEffect(() => {
    if (transcript) {
      setTitle(transcript);
      clearTranscript();
    }
  }, [transcript, clearTranscript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
      reminder_time: reminderTime || undefined
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setReminderTime('');
  };

  const minDateTime = new Date();
  minDateTime.setMinutes(minDateTime.getMinutes() + 1);
  const minDateTimeString = minDateTime.toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Task</h2>
        <VoiceInput
          isListening={isListening}
          onStart={startListening}
          onStop={stopListening}
          error={voiceError}
        />
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            required
          />
        </div>

        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description (optional)"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <AlertCircle size={16} className="inline mr-1" />
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Reminder (optional)
            </label>
            <input
              type="datetime-local"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              min={minDateTimeString}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!title.trim() || loading}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          <span>{loading ? 'Adding...' : 'Add Task'}</span>
        </button>
      </div>
    </form>
  );
};