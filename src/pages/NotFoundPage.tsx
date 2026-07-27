import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button.js';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col justify-center items-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[#5F6FFF] text-white flex items-center justify-center shadow-lg mb-6">
        <Layers className="w-8 h-8" />
      </div>

      <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mt-2">Page Not Found</h2>
      <p className="text-sm text-gray-500 max-w-md mt-2 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link to="/">
        <Button variant="primary" size="md" className="gap-2 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Return to Homepage
        </Button>
      </Link>
    </div>
  );
};
