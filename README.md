# Task Management System

A fully functional Task Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User authentication (register, login)
- Create, read, update, and delete tasks
- Filter tasks by status
- Search tasks by title or description
- Track task progress
- Responsive design for all devices

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

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```
git clone <repository-url>
cd task-management-system
```

2. Install dependencies
```
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
```
# Run both frontend and backend
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Users
- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get user profile (protected)

## Project Structure

```
task-management-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   └── package.json
├── .env
├── package.json
└── README.md
```

## Testing

To run tests:
```
npm test
```

## Deployment

The application can be deployed to platforms like:
- Frontend: Vercel, Netlify
- Backend: Render, Heroku

## License

This project is licensed under the MIT License.