import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut, User, Menu, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
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
    <header className="bg-gray-100 shadow-md border-b border-gray-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <CheckSquare className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">TaskMaster</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
            >
              Dashboard
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/tasks"
                  className="bg-green-100 text-green-800 px-4 py-2 rounded-md hover:bg-green-200 transition-colors"
                >
                  My Tasks
                </Link>
                <Link
                  to="/tasks/new"
                  className="bg-purple-100 text-purple-800 px-4 py-2 rounded-md hover:bg-purple-200 transition-colors"
                >
                  New Task
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-800 font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-md hover:bg-indigo-200 transition-colors"
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
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/tasks"
                    className="bg-green-100 text-green-800 px-4 py-2 rounded-md hover:bg-green-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Tasks
                  </Link>
                  <Link
                    to="/tasks/new"
                    className="bg-purple-100 text-purple-800 px-4 py-2 rounded-md hover:bg-purple-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    New Task
                  </Link>
                  <div className="flex items-center space-x-2 py-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-800 font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors py-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 py-2">
                  <Link
                    to="/login"
                    className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-md hover:bg-indigo-200 transition-colors"
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
