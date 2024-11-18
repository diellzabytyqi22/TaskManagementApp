import React from 'react';
import Task from './Task';

// Define the shape of props for the Column component
interface ColumnProps {
  title: string; // The title of the column (e.g., 'To Do', 'In Progress', etc.)
  tasks: { id: number; title: string; description: string; status: string }[]; // Array of tasks in this column
  onEdit: (taskId: number, newDescription: string) => void; // Function to handle editing a task
  onDelete: (taskId: number) => void; // Function to handle deleting a task
  onDrop: (event: React.DragEvent<HTMLDivElement>, status: string) => void; // Function to handle drop event for drag-and-drop
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void; // Function to handle the dragover event for the drop target
}

const Column: React.FC<ColumnProps> = ({ title, tasks, onEdit, onDelete, onDrop, onDragOver }) => {
  return (
    <div
      className="column"
      onDrop={(event) => onDrop(event, title)} // Pass the column title as the new status when a task is dropped
      onDragOver={onDragOver} // Allow dragging over the column to make it a valid drop target
    >
      <h2 className="column-title">{title}</h2> {/* Display the title of the column */}
      <div className="task-list">
        {/* Iterate through the tasks and render each task */}
        {tasks.map((task) => (
          <Task 
            key={task.id} // Use task id as the key to help React identify each task uniquely
            task={task} // Pass the task object to the Task component
            onEdit={onEdit} // Pass the onEdit function to handle editing task descriptions
            onDelete={onDelete} // Pass the onDelete function to handle task deletion
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
