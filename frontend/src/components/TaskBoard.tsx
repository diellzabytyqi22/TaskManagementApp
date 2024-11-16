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

    if (!destination || destination.droppableId === source.droppableId) return;

    const movedTask = tasks.find((task) => task.id === parseInt(result.draggableId));
    if (!movedTask) return;

    const updatedTasks = tasks.map((task) =>
      task.id === movedTask.id ? { ...task, status: destination.droppableId as Task['status'] } : task
    );
    setTasks(updatedTasks);

    try {
      await axios.put(`http://localhost:3000/tasks/${movedTask.id}`, {
        status: destination.droppableId,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const Column: React.FC<{ status: string; tasks: Task[] }> = ({ status, tasks }) => (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          className={`column ${status.toLowerCase().replace('_', '-')}`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h2>{status.replace('_', ' ')}</h2>
          {tasks
            .filter((task) => task.status === status)
            .map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard task={task} fetchTasks={fetchTasks} />
                  </div>
                )}
              </Draggable>
            ))}
          {provided.placeholder}
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="task-board">
          {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
            <Column key={status} status={status} tasks={tasks} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
