import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import TaskDetails from './pages/TaskDetails';
import TaskForm from './pages/TaskForm';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/routing/PrivateRoute';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <TaskProvider>
              <Router>
                <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                  <Header />
                  <main className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route 
                        path="/tasks" 
                        element={
                          <PrivateRoute>
                            <TaskList />
                          </PrivateRoute>
                        } 
                      />
                      <Route 
                        path="/tasks/:id" 
                        element={
                          <PrivateRoute>
                            <TaskDetails />
                          </PrivateRoute>
                        } 
                      />
                      <Route 
                        path="/tasks/new" 
                        element={
                          <PrivateRoute>
                            <TaskForm />
                          </PrivateRoute>
                        } 
                      />
                      <Route 
                        path="/tasks/edit/:id" 
                        element={
                          <PrivateRoute>
                            <TaskForm />
                          </PrivateRoute>
                        } 
                      />
                      <Route 
                        path="/analytics" 
                        element={
                          <PrivateRoute>
                            <AnalyticsDashboard />
                          </PrivateRoute>
                        } 
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                  <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                  />
                </div>
              </Router>
            </TaskProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;