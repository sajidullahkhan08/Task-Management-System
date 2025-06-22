import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { socketAuth } from './middleware/socketMiddleware.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = createServer(app);

// Setup Socket.IO with proper CORS
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? 'https://task-management-system-production-bfd7.up.railway.app'  // 🔁 Replace with your actual frontend URL
      : 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO authentication and connection handling
io.use(socketAuth);

io.on('connection', (socket) => {
  console.log(`User ${socket.user.name} connected`);

  // Join user to their own room for targeted notifications
  socket.join(socket.userId);

  socket.on('disconnect', () => {
    console.log(`User ${socket.user.name} disconnected`);
  });
});

// Middleware to attach io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check Route for Railway
app.get('/', (req, res) => {
  res.send('Server is alive!');
});

// API Status Route
app.get('/api', (req, res) => {
  res.json({ message: 'API is running...' });
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Dynamic Port for Railway or localhost fallback
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
