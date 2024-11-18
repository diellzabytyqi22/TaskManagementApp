import React, { useState } from 'react';
import axios from 'axios';

const AddTaskForm: React.FC = () => {
  // State to store the title and description of the task
  const [title, setTitle] = useState<string>(''); // Stores task title
  const [description, setDescription] = useState<string>(''); // Stores task description

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submission

    try {
      // Send POST request to backend to create a new task
      await axios.post('http://localhost:3000/tasks', {
        title, // Title of the task
        description, // Description of the task
        status: 'todo', // New tasks start with a 'To Do' status
      });
      // Clear the form fields after successful submission
      setTitle(''); 
      setDescription('');
      // Optionally, you could trigger a re-fetch of tasks here if needed
    } catch (error) {
      console.error("Error adding task:", error); // Handle any errors during the API request
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="Task Title"
          value={title} // Bind input value to state
          onChange={(e) => setTitle(e.target.value)} // Update title state on input change
        />
      </div>
      <div>
        <textarea
          placeholder="Task Description"
          value={description} // Bind textarea value to state
          onChange={(e) => setDescription(e.target.value)} // Update description state on input change
        />
      </div>
      <button type="submit">Add Task</button> {/* Submit button for the form */}
    </form>
  );
};

export default AddTaskForm;
