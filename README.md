# Task Management System (MERN Stack)

A fully functional Task Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application allows users to register, login, and manage their tasks with features like task creation, updating, deletion, filtering, searching, and progress tracking. The UI is responsive and user-friendly.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Architecture Overview](#architecture-overview)  
- [Getting Started](#getting-started)  
- [API Endpoints](#api-endpoints)  
- [Project Structure](#project-structure)  
- [Usage](#usage)  
- [Testing](#testing)  
- [Deployment](#deployment)  
- [Contribution Guidelines](#contribution-guidelines)  
- [Troubleshooting](#troubleshooting)  
- [License](#license)  
- [Contact](#contact)  

---

## Features

- User authentication (register, login) with JWT  
- Create, read, update, and delete tasks  
- Filter tasks by status (Pending, In Progress, Completed)  
- Search tasks by title or description  
- Track task progress with progress bars  
- Responsive design for all devices  
- Input validation and error handling  

---

## Tech Stack

### Backend

- Node.js with Express.js  
- MongoDB with Mongoose  
- JWT Authentication  
- Express Validator for input validation  

### Frontend

- React.js with React Router  
- Context API for state management  
- Tailwind CSS for styling  
- Lucide React for icons  
- Axios for API requests  

---

## Architecture Overview

The project follows a typical MERN stack architecture:

- **Frontend:** React application using functional components and hooks, with Context API for state management. Tailwind CSS is used for styling, and React Router handles routing. Axios is used for API communication.

- **Backend:** Node.js with Express.js serves RESTful API endpoints. MongoDB is used as the database, accessed via Mongoose ODM. JWT is used for secure authentication. Express Validator ensures input validation.

- **Communication:** Frontend communicates with backend via HTTP requests to API endpoints. Authentication tokens are stored and sent with requests to protected routes.

- **Folder Structure:** The backend and frontend are separated into their own directories for modularity and ease of development.

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)  
- MongoDB (local or Atlas)  

### Installation

1. Clone the repository  
   ```bash
   git clone <repository-url>
   cd task-management-system
   ```

2. Install dependencies  
   ```bash
   npm install
   cd frontend
   npm install
   cd ..
   ```

3. Set up environment variables  
   Create a `.env` file in the root directory with the following variables:  
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. Run the application  
   ```bash
   # Run both frontend and backend concurrently
   npm run dev

   # Run backend only
   npm run server

   # Run frontend only
   npm run client
   ```

---

## API Endpoints

### Tasks

- `GET /api/tasks`  
  Get all tasks.  
  **Response:** Array of task objects.

- `GET /api/tasks/:id`  
  Get a single task by ID.  
  **Response:** Task object.

- `POST /api/tasks`  
  Create a new task.  
  **Request Body:**  
  ```json
  {
    "title": "Task title",
    "description": "Task description",
    "status": "Pending | In Progress | Completed",
    "dueDate": "YYYY-MM-DD"
  }
  ```  
  **Response:** Created task object.

- `PUT /api/tasks/:id`  
  Update a task by ID.  
  **Request Body:** Same as POST.  
  **Response:** Updated task object.

- `DELETE /api/tasks/:id`  
  Delete a task by ID.  
  **Response:** Success message.

### Users

- `POST /api/users`  
  Register a new user.  
  **Request Body:**  
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123"
  }
  ```  
  **Response:** User object with token.

- `POST /api/users/login`  
  Login a user.  
  **Request Body:**  
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```  
  **Response:** User object with token.

- `GET /api/users/profile`  
  Get user profile (protected route).  
  **Headers:** Authorization: Bearer token  
  **Response:** User profile object.

---

## Project Structure

```
task-management-system/
├── backend/
│   ├── config/           # Database and environment config
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Auth and error handling middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Express app entry point
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── context/      # React Context for state management
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # React entry point
│   ├── .env              # Frontend environment variables
│   └── package.json      # Frontend dependencies and scripts
├── .env                  # Backend environment variables
├── package.json          # Root dependencies and scripts
└── README.md             # Project documentation
```

---

## Usage

- Register a new user or login with existing credentials.  
- Create new tasks, update or delete existing ones.  
- Filter tasks by status or search by keywords.  
- Track progress visually with progress bars.  
- Responsive UI works on desktop and mobile devices.  

---

## Testing

To run tests:  
```bash
npm test
```

---

## Deployment

The application can be deployed to platforms like:  
- Frontend: Vercel, Netlify  
- Backend: Render, Heroku  

### Environment-specific Configurations

Ensure environment variables are set correctly on the deployment platform, including `MONGO_URI`, `JWT_SECRET`, and `PORT`.

---

## Contribution Guidelines

Contributions are welcome! Please follow these guidelines:

- Fork the repository and create a new branch for your feature or bug fix.  
- Write clear, concise commit messages.  
- Follow existing code style and conventions.  
- Include tests for new features or bug fixes.  
- Submit a pull request with a detailed description of your changes.

---

## Troubleshooting

- Ensure MongoDB is running and connection string is correct.  
- Verify environment variables are set properly.  
- Check console logs for errors during startup or runtime.  
- For frontend issues, clear browser cache and restart the dev server.  

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please open an issue or contact the maintainer.
