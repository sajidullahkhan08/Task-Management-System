import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut, User, Menu, X, Moon, Sun, BarChart3 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import NotificationDropdown from '../notifications/NotificationDropdown';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-100 dark:bg-gray-900 shadow-md border-b border-gray-300 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <CheckSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">TaskMaster</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              Dashboard
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/tasks"
                  className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                >
                  My Tasks
                </Link>
                <Link
                  to="/tasks/new"
                  className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                >
                  New Task
                </Link>
                <Link
                  to="/analytics"
                  className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-4 py-2 rounded-md hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors flex items-center"
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Analytics
                </Link>
                <div className="flex items-center space-x-4">
                  <NotificationDropdown />
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <span className="text-gray-800 dark:text-white font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <Link
                  to="/login"
                  className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-4 py-2 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/tasks"
                    className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Tasks
                  </Link>
                  <Link
                    to="/tasks/new"
                    className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    New Task
                  </Link>
                  <Link
                    to="/analytics"
                    className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-4 py-2 rounded-md hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Analytics
                  </Link>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      <span className="text-gray-800 dark:text-white font-medium">{user?.name}</span>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
                    >
                      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors py-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 py-2">
                  <div className="flex justify-end">
                    <button
                      onClick={toggleDarkMode}
                      className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
                    >
                      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                  </div>
                  <Link
                    to="/login"
                    className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-4 py-2 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors inline-block w-fit"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;