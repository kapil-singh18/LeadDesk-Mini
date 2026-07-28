import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollToForm = () => {
    const elem = document.getElementById('lead-form-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-indigo-50/50 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#5F6FFF] text-xs font-semibold mb-6">
          <Zap className="w-3.5 h-3.5 fill-current" /> High-Conversion Lead Intake Portal
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Capture & Accelerate Your Sales <span className="text-[#5F6FFF]">Lead Pipeline</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Seamless intake forms for prospects paired with a real-time optimistic dashboard for sales teams. Scale your inbound pipeline with confidence.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToForm}
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-[#5F6FFF] hover:bg-[#4B5BEE] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Submit a Lead Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-xs text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Validation & Sanitization
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5F6FFF]" /> JWT Authenticated Portal
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Optimistic UI Updates
          </div>
        </div>
      </div>
    </section>
  );
};
