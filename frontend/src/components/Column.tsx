import React from 'react';
import Task from './Task';

interface ColumnProps {
  title: string;
  tasks: { id: number; title: string; description: string; status: string }[];
  onEdit: (taskId: number, newDescription: string) => void;
  onDelete: (taskId: number) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>, status: string) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
}

const Column: React.FC<ColumnProps> = ({ title, tasks, onEdit, onDelete, onDrop, onDragOver }) => {
  return (
    <div
      className="column"
      onDrop={(event) => onDrop(event, title)} // Pass the column title as the new status
      onDragOver={onDragOver} // Allow drop
    >
      <h2 className="column-title">{title}</h2>
      <div className="task-list">
        {tasks.map((task) => (
          <Task 
            key={task.id} 
            task={task} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
