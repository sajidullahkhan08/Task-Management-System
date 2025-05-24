# Task Management System

This is a full-stack Task Management System project developed as a learning internship task at DevelopersHub Corporation by Sajidullah Khan (ID: DHC-1508). The application allows users to manage their tasks efficiently with features to create, update, delete, and filter tasks.

---

## Author

**Sajidullah Khan**  
DeveloperHub Corporation  
ID: DHC-1508

---

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- express-validator
- express-async-handler
- JSON Web Tokens (JWT) for authentication

### Frontend
- React with TypeScript
- React Router
- React Context API for state management
- Axios for API calls
- Tailwind CSS for styling
- Lucide React icons

---

## Project Structure

```
/backend
  /config          # Database configuration
  /controllers     # API route controllers (taskController, userController)
  /middleware      # Authentication and error handling middleware
  /models          # Mongoose models (Task, User)
  /routes          # Express routes (taskRoutes, userRoutes)
  /utils           # Utility functions (e.g., token generation)
  server.js        # Backend server entry point

/frontend
  /src
    /components
      /common      # Common UI components (Alert)
      /layout      # Layout components (Header, Footer)
      /routing     # Route protection components (PrivateRoute)
      /tasks       # Task related components (TaskItem, TaskFilter, ProgressBar)
    /context       # React Context providers (AuthContext, TaskContext)
    /pages         # Application pages (Dashboard, Login, Register, TaskList, TaskForm, TaskDetails)
    App.tsx        # Main React app component
    main.tsx       # React app entry point
  package.json     # Frontend dependencies and scripts
  tailwind.config.js
  postcss.config.js
```

---

## Backend API Overview

All backend API endpoints require authentication via JWT.

| Endpoint           | Method | Description                    |
|--------------------|--------|--------------------------------|
| `/api/tasks`       | GET    | Get all tasks for the logged-in user |
| `/api/tasks/:id`   | GET    | Get a specific task by ID       |
| `/api/tasks`       | POST   | Create a new task               |
| `/api/tasks/:id`   | PUT    | Update an existing task         |
| `/api/tasks/:id`   | DELETE | Delete a task                   |

---

## Frontend Features

- User authentication and authorization
- View list of tasks with filtering by status and search
- Create, update, and delete tasks
- Task progress visualization with progress bar
- Responsive and clean UI using Tailwind CSS
- State management using React Context API for tasks and authentication
- Alerts for success and error messages

---

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete tasks
- Filter tasks by status (Pending, In Progress, Completed)
- Search tasks by title or description
- Task progress bar showing percentage of completed tasks
- Responsive design with Tailwind CSS
- Protected routes for authenticated users only
- Error and success alerts for user feedback

---

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

---

## Installation Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the required environment variables (see above).

4. Start the backend server:
   ```bash
   node server.js
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## Usage

- Open the frontend application in your browser (usually at `http://localhost:5173`).
- Register a new user or log in with existing credentials.
- Manage your tasks by creating, updating, deleting, filtering, and searching.
- View task progress with the progress bar.
- The backend API handles all data persistence and authentication.

---