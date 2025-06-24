/*
  # Create tasks table with complete schema

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key, auto-generated)
      - `title` (text, required)
      - `description` (text, optional)
      - `completed` (boolean, default false)
      - `priority` (text, default 'medium', constrained to low/medium/high)
      - `reminder_time` (timestamptz, optional)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `tasks` table
    - Add policy for public access to all operations

  3. Indexes
    - Index on completed status for filtering
    - Index on created_at for sorting
    - Index on priority for filtering
    - Primary key index on id

  4. Constraints
    - Check constraint on priority values
    - Primary key constraint on id
*/

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  priority text DEFAULT 'medium',
  reminder_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add check constraint for priority values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tasks_priority_check' 
    AND table_name = 'tasks'
  ) THEN
    ALTER TABLE tasks ADD CONSTRAINT tasks_priority_check 
    CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]));
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks USING btree (completed);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks USING btree (priority);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (allows all operations)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tasks' 
    AND policyname = 'Allow all operations on tasks'
  ) THEN
    CREATE POLICY "Allow all operations on tasks"
      ON tasks
      FOR ALL
      TO public
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;