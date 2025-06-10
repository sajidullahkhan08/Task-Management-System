import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Trash2, Clock, Calendar, CheckCircle, Share2, Users } from 'lucide-react';
import { TaskContext } from '../context/TaskContext';
import Alert from '../components/common/Alert';
import ProgressBar from '../components/tasks/ProgressBar';
import ShareTaskModal from '../components/modals/ShareTaskModal';

const TaskDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { task, getTask, deleteTask, loading, error } = useContext(TaskContext);
  const [showShareModal, setShowShareModal] = useState(false);

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
        <Link to="/tasks" className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Tasks
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="btn btn-secondary flex items-center"
            >
              <Share2 className="h-5 w-5 mr-1" />
              Share
            </button>
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
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Due: {format(new Date(task.dueDate), 'MMMM d, yyyy')}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            <span>Created: {format(new Date(task.createdAt), 'MMMM d, yyyy')}</span>
          </div>
          {task.createdAt !== task.updatedAt && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Updated: {format(new Date(task.updatedAt), 'MMMM d, yyyy')}</span>
            </div>
          )}
        </div>

        {/* Task Owner and Shared Users */}
        {(task.owner || task.sharedWith?.length > 0) && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Collaboration
            </h3>
            {task.owner && (
              <div className="mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Owner: </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {task.owner.name} ({task.owner.email})
                </span>
              </div>
            )}
            {task.sharedWith && task.sharedWith.length > 0 && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Shared with: </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {task.sharedWith.map((user: any) => (
                    <span
                      key={user._id}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {user.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <ProgressBar progress={getProgressFromStatus(task.status)} />

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h2>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            {task.description ? (
              <p className="whitespace-pre-line text-gray-900 dark:text-white">{task.description}</p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No description provided</p>
            )}
          </div>
        </div>
      </div>

      {/* Share Task Modal */}
      <ShareTaskModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        taskId={task._id}
        taskTitle={task.title}
      />
    </div>
  );
};

export default TaskDetails;