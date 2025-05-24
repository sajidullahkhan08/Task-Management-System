import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import TaskDetails from './pages/TaskDetails';
import TaskForm from './pages/TaskForm';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/routing/PrivateRoute';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;