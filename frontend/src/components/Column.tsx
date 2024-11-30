import React from 'react';
import TaskCard from './TaskCard'; // Correct import for TaskCard

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

interface ColumnProps {
  title: string;
  tasks: Task[]; // Array of Task objects
  fetchTasks: () => void; // Function to refresh the tasks
  onDrop: (event: React.DragEvent<HTMLDivElement>, status: string) => void; // Handle drag-and-drop
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void; // Allow drag-over events
}

const Column: React.FC<ColumnProps> = ({ title, tasks, fetchTasks, onDrop, onDragOver }) => {
  return (
    <div
      className="column"
      onDrop={(event) => onDrop(event, title)} // Pass the column title as the new status
      onDragOver={onDragOver} // Allow drag-and-drop events
    >
      <h2 className="column-title">{title}</h2>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            fetchTasks={fetchTasks} // Pass fetchTasks to handle updates
          />
        ))}
      </div>
    </div>
  );
};

export default Column;