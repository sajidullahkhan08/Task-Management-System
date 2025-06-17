import React from 'react';

interface ProgressBarProps {
  progress: number;
  showDescription?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, showDescription = true }) => {
  // Determine color based on progress
  const getColorClass = () => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Progress</h3>
        <span className="text-gray-700 dark:text-gray-300 font-medium">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${getColorClass()}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {showDescription && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {progress === 0
            ? 'No tasks completed yet. Start working on your tasks!'
            : progress === 100
            ? 'All tasks completed! Great job!'
            : `${progress}% of your tasks are completed.`}
        </p>
      )}
    </div>
  );
};

export default ProgressBar;
