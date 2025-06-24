import { useEffect, useRef } from 'react';
import type { Task } from '../types';

export const useReminders = (tasks: Task[]) => {
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    // Clear existing timers
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current.clear();

    // Set up new timers
    tasks.forEach(task => {
      if (task.reminder_time && !task.completed) {
        const reminderTime = new Date(task.reminder_time).getTime();
        const now = Date.now();
        const timeUntilReminder = reminderTime - now;

        if (timeUntilReminder > 0) {
          const timer = setTimeout(() => {
            // Request notification permission if not granted
            if (Notification.permission === 'default') {
              Notification.requestPermission();
            }

            // Show notification or alert
            if (Notification.permission === 'granted') {
              new Notification('Task Reminder', {
                body: task.title,
                icon: '/vite.svg',
                tag: task.id
              });
            } else {
              alert(`Reminder: ${task.title}`);
            }

            timersRef.current.delete(task.id);
          }, timeUntilReminder);

          timersRef.current.set(task.id, timer);
        }
      }
    });

    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, [tasks]);

  // Request notification permission on first load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
};