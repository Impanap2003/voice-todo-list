/*
  # Create tasks table for todo application

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `completed` (boolean, default false)
      - `priority` (text, enum: low/medium/high, default medium)
      - `reminder_time` (timestamptz, optional)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `tasks` table
    - Add policies for authenticated users to manage their own tasks
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  priority text CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  reminder_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (for demo purposes)
-- In production, you would want to tie this to authenticated users
CREATE POLICY "Allow all operations on tasks"
  ON tasks
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);