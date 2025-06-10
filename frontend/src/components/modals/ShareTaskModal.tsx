import React, { useState, useContext } from 'react';
import { X, Share2, UserPlus } from 'lucide-react';
import { TaskContext } from '../../context/TaskContext';
import Alert from '../common/Alert';

interface ShareTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
}

const ShareTaskModal: React.FC<ShareTaskModalProps> = ({
  isOpen,
  onClose,
  taskId,
  taskTitle,
}) => {
  const [emails, setEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { shareTask } = useContext(TaskContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emails.trim()) {
      setError('Please enter at least one email address');
      return;
    }

    const emailList = emails
      .split(',')
      .map(email => email.trim())
      .filter(email => email);

    if (emailList.length === 0) {
      setError('Please enter valid email addresses');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, you'd need to convert emails to user IDs
      // For now, we'll assume the backend can handle email-to-ID conversion
      await shareTask(taskId, emailList);
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setEmails('');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to share task');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Share Task
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Sharing: <span className="font-medium">{taskTitle}</span>
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message="Task shared successfully!" />}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="emails" className="form-label">
              Email Addresses
            </label>
            <textarea
              id="emails"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="Enter email addresses separated by commas&#10;example@email.com, another@email.com"
              className="form-input h-24 resize-none"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Separate multiple email addresses with commas
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              Share Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareTaskModal;