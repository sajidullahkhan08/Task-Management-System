import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import ProgressBar from '../components/tasks/ProgressBar';
import TaskItem from '../components/tasks/TaskItem';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate?: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { tasks, getTasks, deleteTask, getTaskProgress } = useContext(TaskContext);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      getTasks();
    }
  }, [isAuthenticated, getTasks]);

  useEffect(() => {
    if (tasks.length > 0) {
      // Get recent tasks (last 3 created)
      const recent = [...tasks]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
      setRecentTasks(recent);

      // Get upcoming tasks (due in the next 7 days, not completed)
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const upcoming = tasks.filter(
        (task) => {
          if (!task.dueDate || task.status === 'Completed') return false;
          const dueDate = new Date(task.dueDate);
          return dueDate >= today && dueDate <= nextWeek;
        }
      ).slice(0, 3);
      setUpcomingTasks(upcoming);

      // Get overdue tasks
      const overdue = tasks.filter(
        (task) => {
          if (!task.dueDate || task.status === 'Completed') return false;
          const dueDate = new Date(task.dueDate);
          return dueDate < today;
        }
      ).slice(0, 3);
      setOverdueTasks(overdue);
    }
  }, [tasks]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-colors">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Welcome to TaskMaster</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            The ultimate task management solution to boost your productivity
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="btn btn-primary text-center"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn btn-secondary text-center"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 text-center transition-colors">
            <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Track Progress</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your task completion and stay on top of your goals
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 text-center transition-colors">
            <Clock className="h-12 w-12 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Manage Deadlines</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Never miss a deadline with our intuitive due date tracking
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 text-center transition-colors">
            <AlertCircle className="h-12 w-12 text-purple-500 dark:text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Stay Organized</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Keep all your tasks organized with custom statuses and categories
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Link to="/tasks/new" className="btn btn-primary flex items-center">
          <PlusCircle className="h-5 w-5 mr-1" />
          New Task
        </Link>
      </div>

      <ProgressBar progress={getTaskProgress()} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Tasks</h2>
            <Link to="/tasks" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
              View All
            </Link>
          </div>
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map((task) => (
              <TaskItem key={task._id} task={task} onDelete={deleteTask} />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No upcoming tasks</p>
          )}
        </div>

        {/* Overdue Tasks */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Overdue Tasks</h2>
            <Link to="/tasks" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
              View All
            </Link>
          </div>
          {overdueTasks.length > 0 ? (
            overdueTasks.map((task) => (
              <TaskItem key={task._id} task={task} onDelete={deleteTask} />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No overdue tasks</p>
          )}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 mb-6 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
          <Link to="/tasks" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
            View All
          </Link>
        </div>
        {recentTasks.length > 0 ? (
          recentTasks.map((task) => (
            <TaskItem key={task._id} task={task} onDelete={deleteTask} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No tasks created yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
