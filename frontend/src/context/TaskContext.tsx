import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { API_URL } from '../config';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskContextType {
  tasks: Task[];
  task: Task | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  getTasks: () => Promise<void>;
  getTask: (id: string) => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<void>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearTask: () => void;
  clearError: () => void;
  filterTasks: (status: string) => Task[];
  searchTasks: (searchTerm: string) => Task[];
  getTaskProgress: () => number;
}

export const TaskContext = createContext<TaskContextType>({
  tasks: [],
  task: null,
  loading: true,
  error: null,
  success: false,
  getTasks: async () => {},
  getTask: async () => {},
  createTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  clearTask: () => {},
  clearError: () => {},
  filterTasks: () => [],
  searchTasks: () => [],
  getTaskProgress: () => 0,
});

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { user } = useContext(AuthContext);

  // Set up axios config with auth token
  const getConfig = useCallback(() => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(user?.token && { Authorization: `Bearer ${user.token}` }),
      },
    };
    return config;
  }, [user]);

  // Get all tasks
  const getTasks = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setTasks([]);
        setLoading(false);
        return;
      }
      
      const res = await axios.get(`${API_URL}/api/tasks`, getConfig());
      setTasks(res.data);
      setError(null);
    } catch (err: any) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to fetch tasks'
      );
    } finally {
      setLoading(false);
    }
  }, [user, getConfig]);

  // Get single task
  const getTask = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/tasks/${id}`, getConfig());
      setTask(res.data);
      setError(null);
    } catch (err: any) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to fetch task'
      );
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  // Create new task
  const createTask = useCallback(async (taskData: Partial<Task>) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/tasks`, taskData, getConfig());
      setTasks(prevTasks => [...prevTasks, res.data]);
      setSuccess(true);
      setError(null);
      
      // Reset success after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err: any) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to create task'
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  // Update task
  const updateTask = useCallback(async (id: string, taskData: Partial<Task>) => {
    try {
      setLoading(true);
      const res = await axios.put(`${API_URL}/api/tasks/${id}`, taskData, getConfig());
      
      setTasks(prevTasks =>
        prevTasks.map((task) => (task._id === id ? res.data : task))
      );
      
      setTask(res.data);
      setSuccess(true);
      setError(null);
      
      // Reset success after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err: any) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to update task'
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  // Delete task
  const deleteTask = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/tasks/${id}`, getConfig());
      setTasks(prevTasks => prevTasks.filter((task) => task._id !== id));
      setSuccess(true);
      setError(null);
      
      // Reset success after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err: any) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to delete task'
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  // Clear current task
  const clearTask = useCallback(() => {
    setTask(null);
  }, []);

  // Clear errors
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Filter tasks by status
  const filterTasks = useCallback((status: string) => {
    if (status === 'All') {
      return tasks;
    }
    return tasks.filter((task) => task.status === status);
  }, [tasks]);

  // Search tasks
  const searchTasks = useCallback((searchTerm: string) => {
    if (!searchTerm) {
      return tasks;
    }
    
    const term = searchTerm.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term))
    );
  }, [tasks]);

  // Calculate task progress
  const getTaskProgress = useCallback(() => {
    if (tasks.length === 0) {
      return 0;
    }
    
    const completedTasks = tasks.filter(
      (task) => task.status === 'Completed'
    ).length;
    
    return Math.round((completedTasks / tasks.length) * 100);
  }, [tasks]);

  // Load tasks when user changes
  useEffect(() => {
    if (user) {
      getTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user, getTasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        task,
        loading,
        error,
        success,
        getTasks,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        clearTask,
        clearError,
        filterTasks,
        searchTasks,
        getTaskProgress,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};