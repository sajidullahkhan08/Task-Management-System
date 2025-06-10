import React, { useContext, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { BarChart3, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsOverview {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completionRate: number;
}

interface TrendData {
  _id: string;
  count: number;
}

interface AnalyticsTrends {
  creationTrends: TrendData[];
  completionTrends: TrendData[];
  period: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [trends, setTrends] = useState<AnalyticsTrends | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('weekly');
  const { user } = useContext(AuthContext);

  const getConfig = () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      } as any,
    };

    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [overviewRes, trendsRes] = await Promise.all([
        axios.get(`${API_URL}/api/analytics/overview`, getConfig()),
        axios.get(`${API_URL}/api/analytics/trends?period=${period}`, getConfig()),
      ]);

      setOverview(overviewRes.data);
      setTrends(trendsRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!overview || !trends) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Failed to load analytics data</p>
      </div>
    );
  }

  // Status breakdown chart data
  const statusChartData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [overview.completedTasks, overview.inProgressTasks, overview.pendingTasks],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  // Trends chart data
  const trendsChartData = {
    labels: trends.creationTrends.map(item => item._id),
    datasets: [
      {
        label: 'Tasks Created',
        data: trends.creationTrends.map(item => item.count),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Tasks Completed',
        data: trends.completionTrends.map(item => item.count),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="h-6 w-6 mr-2" />
          Analytics Dashboard
        </h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="form-input py-2"
        >
          <option value="weekly">Last 7 Days</option>
          <option value="monthly">Last 30 Days</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview.totalTasks}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview.completedTasks}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview.inProgressTasks}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview.completionRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Task Status Breakdown
          </h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={statusChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Task Creation & Completion Trends
          </h2>
          <div className="h-64">
            <Line data={trendsChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Productivity</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {overview.completionRate >= 70
                ? 'Great job! You have a high completion rate.'
                : overview.completionRate >= 50
                ? 'Good progress! Consider focusing on completing pending tasks.'
                : 'Focus on completing more tasks to improve your productivity.'}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">Task Management</h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              {overview.pendingTasks > overview.inProgressTasks
                ? 'You have many pending tasks. Consider starting work on them.'
                : 'Good balance between pending and in-progress tasks.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;