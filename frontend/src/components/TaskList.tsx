import { useEffect, useState } from 'react';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed?: boolean;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // Type the state

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL; // Get backend URL from env variable

    fetch(`${apiUrl}/tasks`) // Make the API request to backend
      .then(response => response.json())
      .then(data => setTasks(data)) // Update state with fetched data
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {/* Render each task item */}
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
