// src/hooks/useTasks.ts

import useSWR, { mutate } from 'swr';
import axios from 'axios';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useTasks = () => {
  const { data: tasks, error } = useSWR<Task[]>('http://localhost:3000/tasks', fetcher);

  const isLoading = !tasks && !error;
  const isError = !!error;

  // Function to update a task's status (e.g., for drag-and-drop functionality)
  const mutateTaskStatus = async (taskId: number, newStatus: Task['status']) => {
    try {
      // Optimistically update the UI before server response
      mutate(
        'http://localhost:3000/tasks',
        tasks?.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        ),
        false
      );

      // Make request to backend to update the task's status
      await axios.put(`http://localhost:3000/tasks/${taskId}`, { status: newStatus });

      // Revalidate data after server response
      mutate('http://localhost:3000/tasks');
    } catch (error) {
      console.error("Failed to update task status:", error);
      mutate('http://localhost:3000/tasks'); // Revert optimistic update on error
    }
  };

  return { tasks, isLoading, isError, mutateTaskStatus };
};

export default useTasks;
