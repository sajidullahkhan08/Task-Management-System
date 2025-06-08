import React, { useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Trash2, Clock, Calendar, CheckCircle } from 'lucide-react';
import { TaskContext } from '../context/TaskContext';
import Alert from '../components/common/Alert';
import ProgressBar from '../components/tasks/ProgressBar';

const TaskDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { task, getTask, deleteTask, loading, error } = useContext(TaskContext);

  useEffect(() => {
    if (id) {
      getTask(id);
    }
  }, [id]);

  const handleDelete = async () => {
    if (id && window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
      navigate('/tasks');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'badge-pending';
      case 'In Progress':
        return 'badge-progress';
      case 'Completed':
        return 'badge-completed';
      default:
        return 'badge-pending';
    }
  };

  // Map task status to progress percentage
  const getProgressFromStatus = (status: string) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'In Progress':
        return 50;
      case 'Completed':
        return 100;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!task) {
    return <Alert type="error" message="Task not found" />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/tasks" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Tasks
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <div className="flex space-x-2">
            <Link
              to={`/tasks/edit/${task._id}`}
              className="btn btn-secondary flex items-center"
            >
              <Edit className="h-5 w-5 mr-1" />
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-danger flex items-center">
              <Trash2 className="h-5 w-5 mr-1" />
              Delete
            </button>
          </div>
        </div>

          <div className="flex flex-wrap gap-4 mb-6">
          <span className={`badge ${getStatusBadgeClass(task.status)}`}>
            {task.status}
          </span>
          {task.dueDate && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Due: {format(new Date(task.dueDate), 'MMMM d, yyyy')}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>Created: {format(new Date(task.createdAt), 'MMMM d, yyyy')}</span>
          </div>
          {task.createdAt !== task.updatedAt && (
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Updated: {format(new Date(task.updatedAt), 'MMMM d, yyyy')}</span>
            </div>
          )}
        </div>

        <ProgressBar progress={getProgressFromStatus(task.status)} />

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            {task.description ? (
              <p className="whitespace-pre-line">{task.description}</p>
            ) : (
              <p className="text-gray-500 italic">No description provided</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;