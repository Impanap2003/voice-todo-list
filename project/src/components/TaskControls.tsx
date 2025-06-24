import React from 'react';
import { Filter, Trash2, ArrowUpDown } from 'lucide-react';
import type { SortOption } from '../types';

interface TaskControlsProps {
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onClearCompleted: () => void;
  completedCount: number;
}

export const TaskControls: React.FC<TaskControlsProps> = ({
  sortOption,
  onSortChange,
  onClearCompleted,
  completedCount
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <ArrowUpDown size={16} className="text-gray-500 dark:text-gray-400" />
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="alphabetical">Sort Alphabetically</option>
          </select>
        </div>
      </div>

      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
        >
          <Trash2 size={16} />
          <span>Clear Completed ({completedCount})</span>
        </button>
      )}
    </div>
  );
};