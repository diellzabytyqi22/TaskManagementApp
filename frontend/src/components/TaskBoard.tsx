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
    const { destination, source } = result;

  // 1. If there's no valid destination or the task was dropped back in the same column, exit.
    if (!destination || destination.droppableId === source.droppableId) return;
 // 2. Find the task that was moved using the draggableId (task ID).
    const movedTask = tasks.find((task) => task.id === parseInt(result.draggableId));
    if (!movedTask) return;
// 3. Update the task's status based on the destination column (droppableId)
    const updatedTasks = tasks.map((task) =>
      task.id === movedTask.id ? { ...task, status: destination.droppableId as Task['status'] } : task
    );
    setTasks(updatedTasks);// Update the UI optimistically.
 // 4. Persist the change to the backend by making an HTTP PUT request.
    try {
      await axios.put(`http://localhost:3000/tasks/${movedTask.id}`, {
        status: destination.droppableId,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

// Reusable Column component
// The Column component is a functional React component that represents a single task column (e.g., TODO, IN_PROGRESS, DONE).
// It accepts two props:
// 1. `status`: A string indicating the column's status (e.g., "TODO").
// 2. `tasks`: An array of Task objects to display within the column.

const Column: React.FC<{ status: string; tasks: Task[] }> = ({ status, tasks }) => (
  <Droppable droppableId={status}> 
    {/* Droppable component defines the column as a valid drop zone. */}
    {(provided) => (
      <div
        className={`column ${status.toLowerCase().replace('_', '-')}`} 
        // Dynamically assigns a CSS class for styling based on the column's status.
        ref={provided.innerRef} 
        // Reference to the DOM node for the droppable area, required by React Beautiful DnD.
        {...provided.droppableProps} 
        // Spread props required for enabling drop functionality.
      >
        <h2>{status.replace('_', ' ')}</h2> 
        {/* Displays the column's name (e.g., "TO DO") by replacing underscores with spaces. */}
        
        {tasks
          .filter((task) => task.status === status) 
          // Filters tasks to include only those with a status matching the column's status.
          .map((task, index) => (
            <Draggable key={task.id} draggableId={String(task.id)} index={index}> 
              {/* Draggable component enables dragging for each task card. */}
              {(provided) => (
                <div
                  ref={provided.innerRef} 
                  // Reference to the DOM node for the draggable item.
                  {...provided.draggableProps} 
                  // Spread props required to make the task draggable.
                  {...provided.dragHandleProps} 
                  // Spread props for the drag handle (often the entire item).
                >
                  <TaskCard task={task} fetchTasks={fetchTasks} /> 
                  {/* Renders a task card component for the given task. */}
                </div>
              )}
            </Draggable>
          ))}
        {provided.placeholder} 
        {/* Placeholder ensures the layout is maintained during drag-and-drop interactions. */}
      </div>
    )}
  </Droppable>
);

return (
  <div>
    {/* Add Task Form Section */}
    <div className="add-task-form">
      <h3>Add New Task</h3> {/* Section header for adding a new task */}
      <form onSubmit={handleCreate}> 
        {/* Form submission triggers the handleCreate function */}
        <input
          type="text" 
          // Input field for the task title
          placeholder="Task Title" 
          // Placeholder text guides the user to enter the task title
          value={newTask.title} 
          // Binds the input value to the `newTask.title` state
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
          // Updates the title in state when the input value changes
          required 
          // Makes the input field mandatory
        />
        <textarea
          placeholder="Task Description" 
          // Placeholder text guides the user to enter the task description
          value={newTask.description} 
          // Binds the textarea value to the `newTask.description` state
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
          // Updates the description in state when the textarea value changes
          required 
          // Makes the textarea mandatory
        />
        <button type="submit">Add Task</button> 
        {/* Button to submit the form and trigger task creation */}
      </form>
    </div>

    {/* Drag and Drop Context Section */}
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* DragDropContext wraps the draggable and droppable components */}
      <div className="task-board">
        {/* Board layout for task columns */}
        {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
          <Column key={status} status={status} tasks={tasks} />
          // Maps through the predefined statuses to dynamically render each column
        ))}
      </div>
    </DragDropContext>
  </div>
);
}

export default TaskBoard;
