import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<{ title: string; description: string }>({
    title: '',
    description: '',
  });

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create task handler
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.description) return;

    try {
      await axios.post('http://localhost:3000/tasks', {
        title: newTask.title,
        description: newTask.description,
        status: 'TODO', // New tasks default to TODO status
      });
      setNewTask({ title: '', description: '' });
      fetchTasks(); // Re-fetch tasks after adding a new one
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Handle drag and drop event
  const handleDragEnd = async (result: DropResult) => {
    // Destructure `destination` and `source` from the result of the drag event
    const { destination, source } = result;

    // Check if there's no destination or if the task was dropped back in its original position
    if (!destination || destination.droppableId === source.droppableId) return;

    // Find the task being moved using its ID from the draggable element
    const movedTask = tasks.find((task) => task.id === parseInt(result.draggableId));
    if (!movedTask) return; // If the task is not found, do nothing

    // Create a new array with the updated status of the moved task
    const updatedTasks = tasks.map((task) =>
      task.id === movedTask.id ? { ...task, status: destination.droppableId as Task['status'] } : task
    );
    setTasks(updatedTasks); // Update the state to reflect the new status

    // Update the task status in the backend to persist the change
    try {
      await axios.put(`http://localhost:3000/tasks/${movedTask.id}`, {
        status: destination.droppableId,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Reusable Column component
  const Column: React.FC<{ status: string; tasks: Task[] }> = ({ status, tasks }) => (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          className={`column ${status.toLowerCase().replace('_', '-')}`}
          ref={provided.innerRef} // Set the droppable container reference
          {...provided.droppableProps} // Spread droppable props for correct functionality
        >
          <h2>{status.replace('_', ' ')}</h2>
          {tasks
            .filter((task) => task.status === status)
            .map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef} // Set the draggable item reference
                    {...provided.draggableProps} // Spread draggable props for proper dragging
                    {...provided.dragHandleProps} // Spread drag handle props for handling drag interaction
                  >
                    <TaskCard task={task} fetchTasks={fetchTasks} />
                  </div>
                )}
              </Draggable>
            ))}
          {provided.placeholder} {/* Placeholder to maintain space while dragging */}
        </div>
      )}
    </Droppable>
  );

  return (
    <div>
      <div className="add-task-form">
        <h3>Add New Task</h3>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            required
          />
          <button type="submit">Add Task</button>
        </form>
      </div>

      {/* Wrap the board in DragDropContext to enable drag-and-drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="task-board">
          {/* Render columns for each status */}
          {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
            <Column key={status} status={status} tasks={tasks} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
