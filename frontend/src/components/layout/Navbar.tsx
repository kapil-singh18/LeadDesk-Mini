import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { authApiClient } from '../../services/authApiClient.js';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = authApiClient.isAuthenticated();

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  const scrollToLeadForm = () => {
    const element = document.getElementById('lead-form-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#5F6FFF] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            L
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            LeadDesk<span className="text-[#5F6FFF]">Mini</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={scrollToLeadForm}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#5F6FFF] transition-colors"
          >
            Submit Lead
          </button>

          <button
            onClick={handleAdminClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#5F6FFF] bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            {isAuthenticated ? 'Dashboard' : 'Admin Login'}
          </button>

          <button
            onClick={scrollToLeadForm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#5F6FFF] hover:bg-[#4B5BEE] rounded-lg shadow-sm transition-colors"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
