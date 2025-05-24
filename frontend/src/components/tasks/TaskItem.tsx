import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Clock, Edit, Trash2 } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface TaskItemProps {
  task: {
    _id: string;
    title: string;
    description?: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    dueDate?: string;
    createdAt: string;
  };
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete }) => {
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

  return (
    <div className="card p-4 mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 mb-2 line-clamp-2">{task.description}</p>
          )}
          <ProgressBar progress={getProgressFromStatus(task.status)} showDescription={false} />
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className={`badge ${getStatusBadgeClass(task.status)}`}>
              {task.status}
            </span>
            {task.dueDate && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
              </div>
            )}
            <span className="text-xs text-gray-500">
              Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/tasks/edit/${task._id}`}
            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit Task"
          >
            <Edit className="h-5 w-5" />
          </Link>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-red-600 hover:text-red-800 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-3">
        <Link
          to={`/tasks/${task._id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default TaskItem;