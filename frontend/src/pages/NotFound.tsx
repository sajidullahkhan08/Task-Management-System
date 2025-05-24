import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="btn btn-primary inline-flex items-center justify-center"
        >
          <Home className="h-5 w-5 mr-1" />
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;