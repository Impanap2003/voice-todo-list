import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Task, SortOption } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => [data, ...prev]);
    } catch (err) {
      setError('Failed to add task');
      console.error('Error adding task:', err);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => prev.map(task => task.id === id ? data : task));
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const clearCompleted = async () => {
    try {
      setError(null);
      const completedIds = tasks.filter(task => task.completed).map(task => task.id);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', completedIds);

      if (error) throw error;
      setTasks(prev => prev.filter(task => !task.completed));
    } catch (err) {
      setError('Failed to clear completed tasks');
      console.error('Error clearing completed tasks:', err);
    }
  };

  const sortTasks = (tasks: Task[], sortOption: SortOption): Task[] => {
    return [...tasks].sort((a, b) => {
      switch (sortOption) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    clearCompleted,
    sortTasks,
    refetch: fetchTasks
  };
};