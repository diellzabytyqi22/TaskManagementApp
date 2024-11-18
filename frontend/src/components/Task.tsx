import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import './Task.css'; // Assuming you have a separate CSS file for styling

// Define the shape of props for the Task component
interface TaskProps {
  task: { id: number; title: string; description: string }; // Task object containing id, title, and description
  onEdit: (taskId: number, newDescription: string) => void; // Function to handle editing a task
  onDelete: (taskId: number) => void; // Function to handle deleting a task
}

const Task: React.FC<TaskProps> = ({ task, onEdit, onDelete }) => {
  // State for managing the edit mode and the new description
  const [isEditing, setIsEditing] = useState(false); // Track whether the task is in editing mode
  const [newDescription, setNewDescription] = useState(task.description); // Holds the new description during editing

  // Toggle edit mode and update the task description if editing
  const handleEditClick = () => {
    if (isEditing) {
      // If switching from editing mode, update the task description
      onEdit(task.id, newDescription); // Pass the updated description to onEdit function
    }
    setIsEditing(!isEditing); // Toggle the edit mode
  };

  // Handle task deletion
  const handleDeleteClick = () => {
    onDelete(task.id); // Trigger the onDelete function with the task ID
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h4>{task.title}</h4> {/* Display task title */}
        <div className="task-actions">
          {/* Edit button */}
          <button
            className="edit-btn"
            onClick={handleEditClick}
            aria-label="Edit Task"
          >
            <FaEdit /> {/* Icon for editing */}
          </button>
          {/* Delete button */}
          <button
            className="delete-btn"
            onClick={handleDeleteClick}
            aria-label="Delete Task"
          >
            <FaTrashAlt /> {/* Icon for deleting */}
          </button>
        </div>
      </div>
      {/* Task description - toggle between editing mode and display mode */}
      <p className="task-description">
        {isEditing ? (
          <textarea
            value={newDescription} // Bind the textarea value to the newDescription state
            onChange={(e) => setNewDescription(e.target.value)} // Update newDescription on input change
            rows={3} // Set the number of rows for the textarea
          />
        ) : (
          task.description // Display the description if not in editing mode
        )}
      </p>
    </div>
  );
};

export default Task;
