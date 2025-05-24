import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { TaskContext } from '../context/TaskContext';
import TaskItem from '../components/tasks/TaskItem';
import TaskFilter from '../components/tasks/TaskFilter';
import ProgressBar from '../components/tasks/ProgressBar';
import Alert from '../components/common/Alert';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate?: string;
  createdAt: string;
}

const TaskList: React.FC = () => {
  const { tasks, getTasks, deleteTask, error, success, getTaskProgress } = useContext(TaskContext);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = tasks;

    // Filter by status
    if (statusFilter !== 'All') {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          (task.description && task.description.toLowerCase().includes(term))
      );
    }

    setFilteredTasks(result);
  }, [tasks, statusFilter, searchTerm]);

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Link to="/tasks/new" className="btn btn-primary flex items-center">
          <PlusCircle className="h-5 w-5 mr-1" />
          New Task
        </Link>
      </div>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message="Task operation successful!" />}

      <ProgressBar progress={getTaskProgress()} />

      <TaskFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">No tasks found</p>
          <Link to="/tasks/new" className="btn btn-primary inline-flex items-center">
            <PlusCircle className="h-5 w-5 mr-1" />
            Create your first task
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskItem key={task._id} task={task} onDelete={handleDeleteTask} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
