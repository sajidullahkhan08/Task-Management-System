import React, { createContext, useState, useEffect, useContext } from 'react';
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
  const getConfig = () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  };

  // Get all tasks
<<<<<<< HEAD
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
<<<<<<< HEAD
<<<<<<< HEAD
  }, [user, isAuthenticated, getConfig]);

  // Get single task
  const getTask = useCallback(async (id: string) => {
    if (!isAuthenticated || !user) {
      setError('Authentication required');
      return;
    }

=======
  };

  // Get single task
  const getTask = async (id: string) => {
>>>>>>> parent of 5f28930 (Fix Task Management System Code Errors)
=======
  }, [user, getConfig]);

  // Get single task
  const getTask = useCallback(async (id: string) => {
>>>>>>> parent of 3cdcf7a (Fix Task Management System Errors)
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
<<<<<<< HEAD
<<<<<<< HEAD
  }, [isAuthenticated, user, getConfig]);

  // Create new task
  const createTask = useCallback(async (taskData: Partial<Task>) => {
    if (!isAuthenticated || !user) {
      setError('Authentication required');
      return;
    }

=======
  };

  // Create new task
  const createTask = async (taskData: Partial<Task>) => {
>>>>>>> parent of 5f28930 (Fix Task Management System Code Errors)
=======
  }, [getConfig]);

  // Create new task
  const createTask = useCallback(async (taskData: Partial<Task>) => {
>>>>>>> parent of 3cdcf7a (Fix Task Management System Errors)
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/tasks`, taskData, getConfig());
      setTasks([...tasks, res.data]);
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
<<<<<<< HEAD
<<<<<<< HEAD
  }, [isAuthenticated, user, getConfig]);

  // Update task
  const updateTask = useCallback(async (id: string, taskData: Partial<Task>) => {
    if (!isAuthenticated || !user) {
      setError('Authentication required');
      return;
    }

=======
  };

  // Update task
  const updateTask = async (id: string, taskData: Partial<Task>) => {
>>>>>>> parent of 5f28930 (Fix Task Management System Code Errors)
=======
  }, [getConfig]);

  // Update task
  const updateTask = useCallback(async (id: string, taskData: Partial<Task>) => {
>>>>>>> parent of 3cdcf7a (Fix Task Management System Errors)
    try {
      setLoading(true);
      const res = await axios.put(`${API_URL}/api/tasks/${id}`, taskData, getConfig());
      
      setTasks(
        tasks.map((task) => (task._id === id ? res.data : task))
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
<<<<<<< HEAD
<<<<<<< HEAD
  }, [isAuthenticated, user, getConfig]);

  // Delete task
  const deleteTask = useCallback(async (id: string) => {
    if (!isAuthenticated || !user) {
      setError('Authentication required');
      return;
    }

=======
  };

  // Delete task
  const deleteTask = async (id: string) => {
>>>>>>> parent of 5f28930 (Fix Task Management System Code Errors)
=======
  }, [getConfig]);

  // Delete task
  const deleteTask = useCallback(async (id: string) => {
>>>>>>> parent of 3cdcf7a (Fix Task Management System Errors)
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/tasks/${id}`, getConfig());
      setTasks(tasks.filter((task) => task._id !== id));
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
<<<<<<< HEAD
<<<<<<< HEAD
  }, [isAuthenticated, user, getConfig]);
=======
  };
>>>>>>> parent of 5f28930 (Fix Task Management System Code Errors)
=======
  }, [getConfig]);
>>>>>>> parent of 3cdcf7a (Fix Task Management System Errors)

  // Clear current task
  const clearTask = () => {
    setTask(null);
<<<<<<< HEAD
<<<<<<< HEAD
    setError(null);
=======
>>>>>>> parent of 3cdcf7a (Fix Task Management System Errors)
  }, []);
=======
  };
>>>>>>> parent of 5f28930 (Fix Task Management System Code Errors)

  // Clear errors
  const clearError = () => {
    setError(null);
  };

  // Filter tasks by status
  const filterTasks = (status: string) => {
    if (status === 'All') {
      return tasks;
    }
    return tasks.filter((task) => task.status === status);
  };

  // Search tasks
  const searchTasks = (searchTerm: string) => {
    if (!searchTerm) {
      return tasks;
    }
    
    const term = searchTerm.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term))
    );
  };

  // Calculate task progress
  const getTaskProgress = () => {
    if (tasks.length === 0) {
      return 0;
    }
    
    const completedTasks = tasks.filter(
      (task) => task.status === 'Completed'
    ).length;
    
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Load tasks when user changes
  useEffect(() => {
    if (user) {
      getTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
<<<<<<< HEAD
<<<<<<< HEAD
  }, [isAuthenticated, user, getTasks]);

  }, [user]);

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