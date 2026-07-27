import React from 'react';
import { Layers, ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 text-gray-600 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-gray-100">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#5F6FFF] flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                LeadDesk <span className="text-[#5F6FFF]">Mini</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-md leading-relaxed">
              The lightweight, production-grade lead management solution designed for modern digital agencies and enterprise growth teams. Fast, secure, and clear.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full w-fit border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
              <span>Single Admin JWT Secured API</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#hero" className="hover:text-[#5F6FFF] transition-colors">
                  Home Overview
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#5F6FFF] transition-colors">
                  System Features
                </a>
              </li>
              <li>
                <a href="#lead-form" className="hover:text-[#5F6FFF] transition-colors">
                  Contact Sales Form
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
              Administration
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/admin/login" className="hover:text-[#5F6FFF] transition-colors flex items-center gap-1">
                  Admin Login <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-[#5F6FFF] transition-colors flex items-center gap-1">
                  Lead Management Portal <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} LeadDesk Mini. Built with Prescripto Design System & React/Node.js.</p>
          <div className="flex items-center gap-6">
            <span>Prescripto Design Tokens</span>
            <span>REST API Standard Envelope</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
