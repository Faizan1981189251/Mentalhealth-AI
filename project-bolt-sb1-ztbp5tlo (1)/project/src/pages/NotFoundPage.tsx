import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <Brain className="h-12 w-12 text-blue-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center border-4 border-gray-50">
              <span className="text-xl font-bold text-red-600">?</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          We can't seem to find the page you're looking for. 
          The page might have been moved, deleted, or perhaps never existed.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
          >
            <Home className="mr-2 h-5 w-5" />
            Go to Home
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center justify-center"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;