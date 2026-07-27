import React from 'react';
import { ShieldCheck, Search, Filter, Lock, CheckCircle, Zap } from 'lucide-react';
import { Card } from '../ui/Card.js';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <CheckCircle className="w-6 h-6 text-[#5F6FFF]" />,
      title: 'End-to-End Validation',
      description: 'Zod schemas validate inputs on both React Hook Form (client-side) and Express API endpoints (server-side) for zero error leakage.',
    },
    {
      icon: <Search className="w-6 h-6 text-[#5F6FFF]" />,
      title: 'Instant Lead Search',
      description: 'Find any lead instantly by applicant name, email address, or message content with real-time response times.',
    },
    {
      icon: <Filter className="w-6 h-6 text-[#5F6FFF]" />,
      title: 'Status Filtering',
      description: 'Organize incoming potential clients by status (New, Contacted, Closed) with clean inline status updates.',
    },
    {
      icon: <Lock className="w-6 h-6 text-[#5F6FFF]" />,
      title: 'JWT Protected Admin',
      description: 'Admin routes are securely guarded behind JSON Web Token authentication with bcrypt password encryption.',
    },
    {
      icon: <Zap className="w-6 h-6 text-[#5F6FFF]" />,
      title: 'Paginated Lead List',
      description: 'Built-in pagination controls (`page` & `limit` params) ensure smooth performance regardless of dataset volume.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#5F6FFF]" />,
      title: 'Standardized Envelopes',
      description: 'Consistent JSON API response envelopes `{ success, data, error }` across all endpoints for seamless client handling.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#5F6FFF] uppercase tracking-wider bg-[#F2F3FF] px-3 py-1 rounded-full border border-[#5F6FFF]/20">
            System Architecture
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mt-3">
            Engineered For Reliability & Simplicity
          </h2>
          <p className="text-base text-gray-500 mt-3 leading-relaxed">
            Every feature in LeadDesk Mini is built according to strict production standards without bloat or unnecessary complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Card key={idx} hoverEffect className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F2F3FF] flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
