[11:24, 18/11/2024] Diellza Bytyqi: # Task Management App

This is a full-stack Task Management App built with *React, **TypeScript*, 
*Vite, **Node.js, **Express.js, and **Prisma ORM*.
 The application allows users to manage tasks with CRUD operations 
 (Create, Read, Update, Delete) and provides drag-and-drop functionality
  to organize tasks across different columns.

The app integrates with a PostgreSQL database through Prisma, and the backend API 
is built using Express.
 The frontend is powered by React with Vite for fast development and hot module 
 reloading (HMR).

---

## Features

- *Create, Edit, and Delete Tasks*: CRUD functionality for managing tasks.
- *Drag-and-Drop Interface*: Organize tasks across columns using drag-and-drop.
- *Task Status*: Track the progress of tasks (TODO, I…
[11:30, 18/11/2024] Diellza Bytyqi: # Task Management App

This is a full-stack Task Management App built with *React, **TypeScript, **Vite, **Node.js, **Express.js, and **Prisma ORM*. The application allows users to manage tasks with CRUD operations (Create, Read, Update, Delete) and provides drag-and-drop functionality to organize tasks across different columns.

The app integrates with a PostgreSQL database through Prisma, and the backend API is built using Express. The frontend is powered by React with Vite for fast development and hot module reloading (HMR).

---

## Features

- *Create, Edit, and Delete Tasks*: CRUD functionality for managing tasks.
- *Drag-and-Drop Interface*: Organize tasks across columns using drag-and-drop.
- *Task Status*: Track the progress of tasks (TODO, IN_PROGRESS, DONE).
- *Cross-Origin Resource Sharing (CORS)*: Enabled for interaction between the frontend and backend.
- *Data Validation*: Ensures that the correct data is sent to the backend using express-validator.
- *Real-Time Updates*: Though not yet fully implemented, there is a plan to use the Observer Pattern to sync updates across multiple clients.

---

## Tech Stack

- *Frontend*:
  - *React* (with TypeScript)
  - *Vite* for fast build and hot reloading
  - *Tailwind CSS* for styling

- *Backend*:
  - *Node.js* (v20.12.2)
  - *Express.js* for the API
  - *Prisma ORM* for database interaction
  - *PostgreSQL* for the database (using NeonDB for deployment)

- *Other Tools*:
  - *ESLint* for static code analysis and style enforcement
  - *Prettier* for automatic code formatting
  - *Docker* for containerizing the backend server (future integration)

---

## Frontend

### Requirements

- *Node.js* (v16 or later)
- *npm* or *yarn*

### Installation

1. *Clone the repository*:
git clone https://github.com/your-repo/task-management-app.git

2. *Navigate to the frontend directory*:
cd task-management-app/frontend

3. *Install dependencies*:
If you are using npm:
npm install

If you are using yarn:
yarn install

4. *Start the development server*:
npm run dev

The frontend will be running on http://localhost:3000.

# Frontend Features
*Task Creation*: Create new tasks with a title, description, and status.
*Task Update*: Edit the task's title, description, and status.
*Task Deletion*: Remove tasks from the task list.
*Drag-and-Drop*: Organize tasks by dragging and dropping them between columns representing different task statuses (TODO, IN_PROGRESS, DONE).
*Responsive Design*: The app is fully responsive and works on both desktop and mobile devices.

# ESLint and Prettier Configuration
The project comes with ESLint and Prettier pre-configured for a better development experience.

# ESLint Setup
Ensure that your code adheres to the best practices and follows a consistent style by using the ESLint configuration.

# Steps to set up ESLint:

1. *Install the required ESLint dependencies*:

npm install --save-dev eslint eslint-plugin-react @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react-hooks
Update your .eslintrc.js file with the following configuration:


export default tseslint.config({
  settings: { react: { version: '18.3' } },
  plugins: {
    react,
  },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
This configuration ensures the proper linting of TypeScript code, React best practices, and hooks rules.

## Backend

## Requirements

Node.js (v20.12.2 or later)
PostgreSQL (or use NeonDB for cloud database)

### Installation
1. *Navigate to the backend directory*:
cd task-management-app/backend

2. *Install dependencies*:
npm install

3. *Set up environment variables*:
Create a .env file in the root directory of the backend and add your PostgreSQL connection URL as follows:

DATABASE_URL=your_database_url

You can get the database URL from your PostgreSQL provider or use a local PostgreSQL setup.

4. *Run the database migrations*:
Run Prisma migrations to create the necessary tables in the database:
npx prisma migrate dev

5. *Start the backend server*:
npx tsx src/server.ts
The backend will be running on http://localhost:3003.

# Backend API Endpoints
*GET* /tasks: Retrieve all tasks.
*GET* /tasks/
: Retrieve a task by its ID.
*POST* /tasks: Create a new task (requires title, description, status).
*PUT* /tasks/
: Update an existing task (requires title, description, status).
*DELETE* /tasks/
: Delete a task by its ID.
Example Request (POST /tasks)

{
  "title": "New Task",
  "description": "This is a new task",
  "status": "TODO"
}
Example Response

{
  "id": 1,
  "title": "New Task",
  "description": "This is a new task",
  "status": "TODO",
  "completed": false
}
# Future Enhancements
*Observer Pattern*: Implement real-time synchronization using the Observer Pattern.
*User Authentication*: Allow users to sign up and log in to manage their own tasks securely.
*Notifications*: Push notifications to alert users about task updates or changes.