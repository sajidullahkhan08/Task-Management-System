import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';
import { SocketContext } from './SocketContext';
import { API_URL } from '../config';

interface Notification {
  _id: string;
  type: 'task_shared' | 'task_updated' | 'task_completed';
  message: string;
  taskId?: string;
  read: boolean;
  createdAt: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  getNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  getNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const getConfig = useCallback(() => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      } as any,
    };

    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  }, [user]);

  const getNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/notifications`, getConfig());
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getConfig]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await axios.put(`${API_URL}/api/notifications/${id}/read`, {}, getConfig());
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [getConfig]);

  const markAllAsRead = useCallback(async () => {
    try {
      await axios.put(`${API_URL}/api/notifications/read-all`, {}, getConfig());
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, [getConfig]);

  const unreadCount = notifications.filter(notif => !notif.read).length;

  // Socket event listeners
  useEffect(() => {
    if (socket) {
      socket.on('notification', (data) => {
        // Add new notification to the list
        const newNotification: Notification = {
          _id: Date.now().toString(),
          type: data.type,
          message: data.message,
          taskId: data.taskId,
          read: false,
          createdAt: new Date().toISOString(),
          sender: {
            _id: '',
            name: 'System',
            email: '',
          },
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Show toast notification
        toast.info(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });

      return () => {
        socket.off('notification');
      };
    }
  }, [socket]);

  // Load notifications on mount
  useEffect(() => {
    if (isAuthenticated) {
      getNotifications();
    }
  }, [isAuthenticated, getNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        getNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};