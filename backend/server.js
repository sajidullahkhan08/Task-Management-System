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

// Load .env variables
console.log("🌱 Loading environment variables...");
dotenv.config();

// Connect to MongoDB
console.log("🔌 Connecting to MongoDB...");
connectDB();

console.log("🚀 Setting up Express app...");
const app = express();
const server = createServer(app);

// Setup Socket.IO with production-friendly CORS
console.log("⚡ Setting up Socket.IO...");
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? 'https://task-management-system-production-505f.up.railway.app' // ✅ Replace with your actual frontend URL
      : 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Authenticate and listen to Socket.IO
io.use(socketAuth);

io.on('connection', (socket) => {
  console.log(`✅ Socket connected: ${socket.user?.name}`);

  // Join room
  socket.join(socket.userId);

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.user?.name}`);
  });
});

// Attach io instance to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Global middleware
console.log("🧱 Mounting middleware...");
app.use(cors());
app.use(express.json());

// Routes
console.log("📦 Mounting routes...");
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('✅ Server is alive!');
});

// API status check
app.get('/api', (req, res) => {
  res.json({ message: '✅ API is running...' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
console.log(`🎧 About to listen on port ${PORT}...`);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
