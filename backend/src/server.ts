import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

// Middleware to parse JSON requests and enable CORS for all routes
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Middleware to handle validation errors
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: Function
): void => {
  const errors = validationResult(req); // Check if there are any validation errors
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() }); // Return validation errors if any
    return;
  }
  next(); // Continue to the next middleware or route handler
};

// Get all tasks
app.get('/tasks', async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany(); // Fetch all tasks from the database
    res.json(tasks); // Return the list of tasks as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unknown error occurred.' }); // Handle unexpected errors
  }
});

// Get a specific task by ID
app.get('/tasks/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: parseInt(req.params.id, 10), // Convert the ID from string to number
      },
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' }); // Return error if task is not found
      return;
    }

    res.json(task); // Return the task as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unknown error occurred.' }); // Handle unexpected errors
  }
});

// Create a new task
app.post(
  '/tasks',
  [
    body('title').isString().notEmpty().withMessage('Title is required'), // Validate title as a non-empty string
    body('description').optional().isString(), // Validate description as a string if provided
    body('completed').optional().isBoolean(), // Validate completed as a boolean if provided
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Invalid status'), // Validate status if provided
  ],
  handleValidationErrors, // Use validation error handler middleware
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, completed = false, status = 'TODO' } = req.body;
      const newTask = await prisma.task.create({
        data: { title, description, completed, status }, // Create a new task in the database
      });
      res.status(201).json(newTask); // Return the created task with a 201 status code
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An unknown error occurred.' }); // Handle unexpected errors
    }
  }
);

// Update a task
app.put('/tasks/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, completed, status } = req.body;
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(req.params.id, 10) }, // Find task by ID
      data: { title, description, completed, status }, // Update task data
    });
    res.json(updatedTask); // Return the updated task as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unknown error occurred.' }); // Handle unexpected errors
  }
});

// Delete a task
app.delete('/tasks/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.task.delete({
      where: { id: parseInt(req.params.id, 10) }, // Delete task by ID
    });
    res.status(204).end(); // Return 204 No Content status indicating successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unknown error occurred.' }); // Handle unexpected errors
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log the server start message
});
