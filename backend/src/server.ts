import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

// Enable CORS for localhost (during development) and Vercel domain (production)
const allowedOrigins = [
  'http://localhost:5173', // localhost during development
  'https://task-management-app-two-jet.vercel.app', // Vercel domain in production
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
  })
);

app.use(express.json());

// Middleware to handle validation errors
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: Function
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

// Get all tasks
app.get('/tasks', async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks); // Send response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unknown error occurred.' });
  }
});

// Get a specific task by ID
app.get('/tasks/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: parseInt(req.params.id, 10),
      },
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unknown error occurred.' });
  }
});

// Create a new task
app.post(
  '/tasks',
  [
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('completed').optional().isBoolean(),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Invalid status'),
  ],
  handleValidationErrors,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, completed = false, status = 'TODO' } = req.body;
      const newTask = await prisma.task.create({
        data: { title, description, completed, status },
      });
      res.status(201).json(newTask);  // Respond with the created task
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An unknown error occurred.' });
    }
  }
);

// Update a task
app.put('/tasks/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, completed, status } = req.body;
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { title, description, completed, status },
    });
    res.json(updatedTask); // Respond with the updated task
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unknown error occurred.' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.task.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    res.status(204).end(); // No content, task deleted successfully
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unknown error occurred.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
