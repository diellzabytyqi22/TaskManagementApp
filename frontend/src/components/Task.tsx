import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import './Task.css'; // Assuming you have a separate CSS file

interface TaskProps {
  task: { id: number; title: string; description: string };
  onEdit: (taskId: number, newDescription: string) => void;
  onDelete: (taskId: number) => void;
}

const Task: React.FC<TaskProps> = ({ task, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(task.description);

  const handleEditClick = () => {
    if (isEditing) {
      // Perform task editing logic (e.g., API call or state update)
      onEdit(task.id, newDescription); // Pass the updated description
    }
    setIsEditing(!isEditing);
  };

  const handleDeleteClick = () => {
    onDelete(task.id);
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h4>{task.title}</h4>
        <div className="task-actions">
          <button
            className="edit-btn"
            onClick={handleEditClick}
            aria-label="Edit Task"
          >
            <FaEdit />
          </button>
          <button
            className="delete-btn"
            onClick={handleDeleteClick}
            aria-label="Delete Task"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
      <p className="task-description">
        {isEditing ? (
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={3}
          />
        ) : (
          task.description
        )}
      </p>
    </div>
  );
};

export default Task;
