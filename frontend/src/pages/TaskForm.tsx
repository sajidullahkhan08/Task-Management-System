import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { TaskContext } from '../context/TaskContext';
import Alert from '../components/common/Alert';

interface FormData {
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
}

interface FormErrors {
  title: string;
}

const TaskForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { task, getTask, createTask, updateTask, loading, error, success, clearTask, clearError } = useContext(TaskContext);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    status: 'Pending',
    dueDate: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    title: '',
  });

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode && id) {
      getTask(id);
    } else {
      clearTask();
    }

    return () => {
      clearTask();
      clearError();
    };
  }, [id, isEditMode, getTask, clearTask, clearError]);

  useEffect(() => {
    if (task && isEditMode) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pending',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [task, isEditMode]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/tasks');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (name === 'title' && formErrors.title) {
      setFormErrors({
        ...formErrors,
        title: '',
      });
    }

    // Clear global error when user makes changes
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const errors: FormErrors = {
      title: '',
    };

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const taskData = {
      ...formData,
      dueDate: formData.dueDate || undefined,
    };

    if (isEditMode && id) {
      await updateTask(id, taskData);
    } else {
      await createTask(taskData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/tasks" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Tasks
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? 'Edit Task' : 'Create New Task'}
        </h1>

        {error && <Alert type="error" message={error} onClose={clearError} />}
        {success && <Alert type="success" message={`Task ${isEditMode ? 'updated' : 'created'} successfully!`} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${formErrors.title ? 'border-red-500' : ''}`}
              placeholder="Enter task title"
              disabled={loading}
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="form-input"
              placeholder="Enter task description (optional)"
              disabled={loading}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate" className="form-label">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Link to="/tasks" className="btn btn-secondary mr-2">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <Save className="h-5 w-5 mr-1" />
              )}
              {isEditMode ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;