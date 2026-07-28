import React from 'react';
import { Shield, Zap, Search, BarChart3 } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-[#5F6FFF]" />,
      title: 'Instant Lead Qualification',
      description: 'Zod-validated intake fields ensure required contact details and budget criteria before reaching your database.',
    },
    {
      icon: <Search className="w-6 h-6 text-[#5F6FFF]" />,
      title: 'Real-Time Server Search',
      description: 'Find any lead instantly by applicant name, email address, or message content with real-time response times.',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-[#5F6FFF]" />,
      title: 'Optimistic State Updates',
      description: 'Status changes from New to Contacted or Closed update instantly in the UI with automated network failure rollback.',
    },
    {
      icon: <Shield className="w-6 h-6 text-[#5F6FFF]" />,
      title: 'Enterprise Security',
      description: 'Role-based authorization header validation, rate-limiting, Helmet headers, and sanitized database queries.',
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Engineered for High-Performance Sales Operations</h2>
          <p className="mt-3 text-sm text-gray-500">
            A comprehensive suite of tools built for speed, reliability, and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-indigo-100 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
