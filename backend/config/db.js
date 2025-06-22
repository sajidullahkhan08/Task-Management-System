import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'logs', 'db-connection.log');

const ensureLogDirectoryExists = () => {
  const logDir = path.dirname(logFilePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

const logConnectionInfo = (message) => {
  ensureLogDirectoryExists();
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // Log a simple success message to console
    console.log('MongoDB is Connected Successfully..!');

    // Log detailed host info securely to a file
    logConnectionInfo(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
