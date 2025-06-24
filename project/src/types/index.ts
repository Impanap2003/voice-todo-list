export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  reminder_time?: string;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  text: string;
  author: string;
}

export type SortOption = 'date' | 'priority' | 'alphabetical';
export type Theme = 'light' | 'dark';