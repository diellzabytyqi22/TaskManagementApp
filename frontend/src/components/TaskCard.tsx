import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

// Interface for Task object, describing its structure
interface Task {
  id: number; // Unique identifier for the task
  title: string; // Title of the task
  description: string; // Description of the task
  status: string; // Current status of the task (e.g., TODO, IN_PROGRESS, DONE)
}

// Props for TaskCard component
interface TaskCardProps {
  task: Task; // The task data to display and manage
  fetchTasks: () => void; // Callback function to refresh the task list
}

const TaskCard: React.FC<TaskCardProps> = ({ task, fetchTasks }) => {
  // Local state to manage editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title); // Local state for task title when editing
  const [newDescription, setNewDescription] = useState(task.description); // Local state for task description when editing

  // Function to handle task deletion
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${task.id}`); 
      // Sends a DELETE request to remove the task from the backend
      fetchTasks(); 
      // Refreshes the task list after successful deletion
    } catch (error) {
      console.error('Error deleting task:', error); 
      // Logs an error message if the delete request fails
    }
  };

  // Function to handle task editing
  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/tasks/${task.id}`, {
        title: newTitle, 
        // Sends the updated title to the backend
        description: newDescription, 
        // Sends the updated description to the backend
      });
      setIsEditing(false); 
      // Exits editing mode upon successful update
      fetchTasks(); 
      // Refreshes the task list to reflect changes
    } catch (error) {
      console.error('Error updating task:', error); 
      // Logs an error message if the update request fails
    }
  };

  return (
    <div className="task-card">
      {isEditing ? (
        <>
          {/* Editing mode - displays input fields to edit the task */}
          <input
            type="text"
            value={newTitle} 
            // Displays and binds the title to local state
            onChange={(e) => setNewTitle(e.target.value)} 
            // Updates the title state on user input
            className="w-full mb-2 p-1 border rounded" 
            // Styling for input
          />
          <textarea
            value={newDescription} 
            // Displays and binds the description to local state
            onChange={(e) => setNewDescription(e.target.value)} 
            // Updates the description state on user input
            className="w-full mb-2 p-1 border rounded" 
            // Styling for textarea
          />
          <button onClick={handleEdit} className="save-btn">
            Save 
            {/* Button to confirm task editing */}
          </button>
        </>
      ) : (
        <>
          {/* Default mode - displays task title and description */}
          <h4 className="task-title">{task.title}</h4> 
          {/* Task title */}
          <p className="task-description">{task.description}</p> 
          {/* Task description */}
          <div className="icon-container">
            {/* Action icons for editing and deleting */}
            <FontAwesomeIcon
              icon={faEdit}
              className="edit-icon" 
              // Styling for the edit icon
              onClick={() => setIsEditing(true)} 
              // Toggles editing mode on click
            />
            <FontAwesomeIcon
              icon={faTrash}
              className="delete-icon" 
              // Styling for the delete icon
              onClick={handleDelete} 
              // Triggers the delete functionality
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
