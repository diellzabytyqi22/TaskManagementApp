import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

interface TaskCardProps {
  task: Task;
  fetchTasks: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, fetchTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${task.id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/tasks/${task.id}`, {
        title: newTitle,
        description: newDescription,
      });
      setIsEditing(false);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="task-card">
      {isEditing ? (
        <>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full mb-2 p-1 border rounded"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full mb-2 p-1 border rounded"
          />
          <button onClick={handleEdit} className="save-btn">
            Save
          </button>
        </>
      ) : (
        <>
          <h4 className="task-title">{task.title}</h4>
          <p className="task-description">{task.description}</p>
          <div className="icon-container">
            <FontAwesomeIcon
              icon={faEdit}
              className="edit-icon"
              onClick={() => setIsEditing(true)}
            />
            <FontAwesomeIcon
              icon={faTrash}
              className="delete-icon"
              onClick={handleDelete}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
