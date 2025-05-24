import React from 'react';
import { CheckSquare, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <CheckSquare className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold">TaskMaster</span>
          </div>
          
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-300">
              Manage your tasks efficiently with TaskMaster
            </p>
            <p className="text-gray-400 text-sm mt-1">
              © {new Date().getFullYear()} TaskMaster. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;