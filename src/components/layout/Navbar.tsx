import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Send, Layers } from 'lucide-react';
import { Button } from '../ui/Button.js';
import { authApiClient } from '../../services/authApiClient.js';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authApiClient.isAuthenticated();

  const handleLogout = () => {
    authApiClient.logout();
    navigate('/');
  };

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-[#5F6FFF] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-gray-900 leading-none">
              LeadDesk <span className="text-[#5F6FFF]">Mini</span>
            </span>
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
              Lead System
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-[#5F6FFF] transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('lead-form')}
            className="hover:text-[#5F6FFF] transition-colors cursor-pointer"
          >
            Submit Lead
          </button>
          {isAuthenticated ? (
            <Link
              to="/admin/dashboard"
              className={`hover:text-[#5F6FFF] transition-colors flex items-center gap-1.5 ${
                location.pathname.startsWith('/admin') ? 'text-[#5F6FFF] font-semibold' : ''
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="hover:text-[#5F6FFF] transition-colors"
            >
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Right CTA Button */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/admin/dashboard">
                <Button variant="secondary" size="sm" className="hidden sm:inline-flex gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Panel
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={() => scrollToSection('lead-form')}
              className="gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" />
              Get Started
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
