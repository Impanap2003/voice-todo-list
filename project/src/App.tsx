import React, { useState } from 'react';
import { CheckSquare, AlertCircle } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { QuoteDisplay } from './components/QuoteDisplay';
import { ThemeToggle } from './components/ThemeToggle';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { TaskControls } from './components/TaskControls';
import { useTheme } from './hooks/useTheme';
import { useTasks } from './hooks/useTasks';
import { useReminders } from './hooks/useReminders';
import type { SortOption } from './types';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { tasks, loading, error, addTask, updateTask, deleteTask, clearCompleted, sortTasks } = useTasks();
  const [sortOption, setSortOption] = useState<SortOption>('date');
  
  useReminders(tasks);

  const sortedTasks = sortTasks(tasks, sortOption);
  const completedCount = tasks.filter(task => task.completed).length;

  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md w-full text-center">
          <AlertCircle size={48} className="mx-auto text-orange-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Database Setup Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please click the "Connect to Supabase" button in the top right to set up your database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg">
                <CheckSquare size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Smart Todo
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your intelligent task manager
                </p>
              </div>
            </div>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>

          {/* Daily Quote */}
          <QuoteDisplay />

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-2" size={20} />
                <span className="text-red-700 dark:text-red-400">{error}</span>
              </div>
            </div>
          )}

          {/* Task Form */}
          <TaskForm onSubmit={addTask} loading={loading} />

          {/* Task Controls */}
          <TaskControls
            sortOption={sortOption}
            onSortChange={setSortOption}
            onClearCompleted={clearCompleted}
            completedCount={completedCount}
          />

          {/* Task List */}
          <TaskList
            tasks={sortedTasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
            loading={loading}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;